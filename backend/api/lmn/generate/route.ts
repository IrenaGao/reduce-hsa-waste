import { NextRequest, NextResponse } from 'next/server';
import { LMNGeneratorService, LMNGenerationRequest } from '../../services/lmnGeneratorService';
import { ICD10Service } from '../../services/icd10Service';
import { HSAProviderService } from '../../services/hsaProviderService';

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

    const lmnRequest: LMNGenerationRequest = {
      healthQuestionnaireData: body.healthQuestionnaireData,
      serviceInfo: body.serviceInfo,
      hsaProvider: body.hsaProvider,
      providerInfo: body.providerInfo,
    };

    // Validate HSA provider exists
    const hsaProvider = HSAProviderService.getProvider(body.hsaProvider);
    if (!hsaProvider) {
      return NextResponse.json(
        { error: `HSA provider '${body.hsaProvider}' not found` },
        { status: 400 }
      );
    }

    // Validate medical necessity
    const conditions = body.healthQuestionnaireData.selectedHealthConditions || [];
    const serviceName = body.serviceInfo.name;
    const isMedicallyJustified = conditions.some((condition: string) => 
      ICD10Service.isMedicallyJustified(condition, serviceName)
    );

    if (!isMedicallyJustified && conditions.length > 0) {
      return NextResponse.json(
        { 
          error: 'The selected conditions do not justify medical necessity for this service',
          details: 'Please ensure the selected medical conditions are applicable to the requested service'
        },
        { status: 400 }
      );
    }

    // Generate LMN
    const lmnDocument = await LMNGeneratorService.generateLMN(lmnRequest);

    return NextResponse.json({
      success: true,
      lmnDocument,
      providerInfo: {
        name: hsaProvider.name,
        lmnRequired: hsaProvider.lmnRequired,
        digitalSubmission: hsaProvider.digitalSubmission,
        contactInfo: hsaProvider.contactInfo,
      },
    });

  } catch (error) {
    console.error('Error generating LMN:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Letter of Medical Necessity',
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
      case 'providers':
        // Get all available HSA providers
        const providers = HSAProviderService.getAllProviders();
        return NextResponse.json({
          success: true,
          providers: providers.map(provider => ({
            name: provider.name,
            code: provider.code,
            lmnRequired: provider.lmnRequired,
            digitalSubmission: provider.digitalSubmission,
            contactInfo: provider.contactInfo,
          })),
        });

      case 'requirements':
        // Get LMN requirements for a specific provider
        const providerName = searchParams.get('provider');
        if (!providerName) {
          return NextResponse.json(
            { error: 'Provider name is required' },
            { status: 400 }
          );
        }

        const requirements = HSAProviderService.getLMNRequirements(providerName);
        if (!requirements) {
          return NextResponse.json(
            { error: 'Provider not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          requirements,
        });

      case 'conditions':
        // Get all available medical conditions
        const conditions = ICD10Service.getAllConditions();
        return NextResponse.json({
          success: true,
          conditions,
        });

      case 'services':
        // Get all available services
        const services = ICD10Service.getAllServices();
        return NextResponse.json({
          success: true,
          services: services.map(service => ({
            name: service.service,
            category: service.serviceCategory,
            applicableConditions: service.applicableConditions.map(condition => condition.condition),
            clinicalRationale: service.clinicalRationale,
          })),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in LMN API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
