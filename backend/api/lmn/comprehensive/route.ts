import { NextRequest, NextResponse } from 'next/server';
import { LMNGeneratorService, LMNGenerationRequest } from '../../services/lmnGeneratorService';
import { ICD10Service } from '../../services/icd10Service';
import { HSAProviderService } from '../../services/hsaProviderService';
import { ClinicalRationaleEngine } from '../../services/clinicalRationaleEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['healthQuestionnaireData', 'serviceInfo', 'hsaProvider', 'providerInfo'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { healthQuestionnaireData, serviceInfo, hsaProvider, providerInfo } = body;

    // Step 1: Validate HSA provider
    const hsaProviderInfo = HSAProviderService.getProvider(hsaProvider);
    if (!hsaProviderInfo) {
      return NextResponse.json(
        { error: `HSA provider '${hsaProvider}' not found` },
        { status: 400 }
      );
    }

    // Step 2: Get ICD-10 codes for the service and conditions
    const conditions = healthQuestionnaireData.selectedHealthConditions || [];
    const icd10Codes = ICD10Service.getICD10CodesForService(serviceInfo.name, conditions);
    
    if (icd10Codes.length === 0 && conditions.length > 0) {
      return NextResponse.json(
        { 
          error: 'No applicable ICD-10 codes found for the selected conditions and service',
          details: 'Please ensure the selected medical conditions are applicable to the requested service'
        },
        { status: 400 }
      );
    }

    // Step 3: Validate medical necessity using clinical rationale engine
    const medicalNecessityValidation = ClinicalRationaleEngine.validateMedicalNecessity(
      conditions[0] || '',
      serviceInfo.name.toLowerCase().replace(/\s+/g, '_'),
      healthQuestionnaireData.conditionsPreventing || []
    );

    if (!medicalNecessityValidation.isMedicallyNecessary) {
      return NextResponse.json(
        { 
          error: 'Medical necessity not established',
          details: 'The clinical evidence does not support medical necessity for this service-condition combination',
          confidence: medicalNecessityValidation.confidence,
          rationale: medicalNecessityValidation.rationale
        },
        { status: 400 }
      );
    }

    // Step 4: Generate enhanced clinical rationale
    const enhancedRationale = ClinicalRationaleEngine.generateClinicalRationale(
      conditions[0] || '',
      serviceInfo.name.toLowerCase().replace(/\s+/g, '_'),
      healthQuestionnaireData.conditionsPreventing || []
    );

    // Step 5: Generate treatment plan
    const treatmentPlan = ClinicalRationaleEngine.generateTreatmentPlan(
      conditions[0] || '',
      serviceInfo.name.toLowerCase().replace(/\s+/g, '_'),
      healthQuestionnaireData.healthConditions || ''
    );

    // Step 6: Get clinical references
    const clinicalReferences = ClinicalRationaleEngine.getClinicalReferences(
      conditions[0] || '',
      serviceInfo.name.toLowerCase().replace(/\s+/g, '_')
    );

    // Step 7: Analyze risk factors
    const riskFactors = ClinicalRationaleEngine.analyzeRiskFactors(
      conditions[0] || '',
      healthQuestionnaireData.conditionsPreventing || []
    );

    // Step 8: Prepare enhanced LMN data
    const enhancedLMNRequest: LMNGenerationRequest = {
      healthQuestionnaireData: {
        ...healthQuestionnaireData,
        enhancedClinicalRationale: enhancedRationale,
        treatmentPlan,
        clinicalReferences,
        riskFactors
      },
      serviceInfo,
      hsaProvider,
      providerInfo
    };

    // Step 9: Generate LMN document
    const lmnDocument = await LMNGeneratorService.generateLMN(enhancedLMNRequest);

    // Step 10: Prepare comprehensive response
    const response = {
      success: true,
      lmnDocument,
      medicalNecessityValidation: {
        isMedicallyNecessary: medicalNecessityValidation.isMedicallyNecessary,
        confidence: medicalNecessityValidation.confidence,
        rationale: medicalNecessityValidation.rationale
      },
      clinicalAnalysis: {
        icd10Codes,
        primaryDiagnosis: icd10Codes[0] || null,
        enhancedRationale,
        treatmentPlan,
        clinicalReferences,
        riskFactors
      },
      hsaProviderInfo: {
        name: hsaProviderInfo.name,
        lmnRequired: hsaProviderInfo.lmnRequired,
        digitalSubmission: hsaProviderInfo.digitalSubmission,
        submissionMethod: HSAProviderService.getSubmissionMethod(hsaProvider),
        contactInfo: hsaProviderInfo.contactInfo,
        additionalRequirements: HSAProviderService.getLMNRequirements(hsaProvider)?.additionalRequirements || []
      },
      recommendations: {
        submissionMethod: HSAProviderService.getSubmissionMethod(hsaProvider),
        estimatedProcessingTime: hsaProviderInfo.digitalSubmission ? '1-3 business days' : '5-10 business days',
        followUpRequired: true,
        documentationNeeded: HSAProviderService.getLMNRequirements(hsaProvider)?.requiredFields || []
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in comprehensive LMN generation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate comprehensive Letter of Medical Necessity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'validate':
        // Validate medical necessity for a condition-service combination
        const condition = searchParams.get('condition');
        const service = searchParams.get('service');
        const riskFactors = searchParams.get('riskFactors')?.split(',') || [];

        if (!condition || !service) {
          return NextResponse.json(
            { error: 'Condition and service are required' },
            { status: 400 }
          );
        }

        const validation = ClinicalRationaleEngine.validateMedicalNecessity(
          condition,
          service.toLowerCase().replace(/\s+/g, '_'),
          riskFactors
        );

        return NextResponse.json({
          success: true,
          validation,
          icd10Codes: ICD10Service.getICD10CodesForService(service, [condition]),
          clinicalReferences: ClinicalRationaleEngine.getClinicalReferences(condition, service.toLowerCase().replace(/\s+/g, '_'))
        });

      case 'rationale':
        // Get clinical rationale for a condition-service combination
        const conditionForRationale = searchParams.get('condition');
        const serviceForRationale = searchParams.get('service');
        const additionalFactors = searchParams.get('additionalFactors')?.split(',') || [];

        if (!conditionForRationale || !serviceForRationale) {
          return NextResponse.json(
            { error: 'Condition and service are required' },
            { status: 400 }
          );
        }

        const rationale = ClinicalRationaleEngine.generateClinicalRationale(
          conditionForRationale,
          serviceForRationale.toLowerCase().replace(/\s+/g, '_'),
          additionalFactors
        );

        return NextResponse.json({
          success: true,
          rationale,
          treatmentPlan: ClinicalRationaleEngine.generateTreatmentPlan(
            conditionForRationale,
            serviceForRationale.toLowerCase().replace(/\s+/g, '_')
          )
        });

      case 'analysis':
        // Comprehensive analysis for a service
        const serviceForAnalysis = searchParams.get('service');
        const conditionsForAnalysis = searchParams.get('conditions')?.split(',') || [];

        if (!serviceForAnalysis) {
          return NextResponse.json(
            { error: 'Service is required' },
            { status: 400 }
          );
        }

        const analysis = {
          service: serviceForAnalysis,
          applicableConditions: [],
          medicalNecessityScores: {},
          recommendations: []
        };

        // Analyze each condition
        for (const condition of conditionsForAnalysis) {
          const icd10Codes = ICD10Service.getICD10CodesForService(serviceForAnalysis, [condition]);
          const validation = ClinicalRationaleEngine.validateMedicalNecessity(
            condition,
            serviceForAnalysis.toLowerCase().replace(/\s+/g, '_'),
            []
          );

          analysis.applicableConditions.push({
            condition,
            icd10Codes,
            isMedicallyJustified: validation.isMedicallyNecessary,
            confidence: validation.confidence
          });

          analysis.medicalNecessityScores[condition] = validation.confidence;
        }

        return NextResponse.json({
          success: true,
          analysis
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in comprehensive LMN API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
