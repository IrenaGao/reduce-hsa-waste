/**
 * Letter of Medical Necessity Generator Service
 * Generates LMN documents based on health questionnaire data and HSA provider requirements
 */

import { ICD10Mapping, ICD10Service } from './icd10Service';
import { HSAProviderService, LMNData, HSAProvider } from './hsaProviderService';

export interface LMNDocument {
  id: string;
  provider: string;
  patientName: string;
  serviceName: string;
  generatedDate: string;
  status: 'draft' | 'ready' | 'submitted' | 'approved' | 'denied';
  content: string;
  pdfPath?: string;
  digitalId?: string;
}

export interface LMNGenerationRequest {
  healthQuestionnaireData: any;
  serviceInfo: {
    name: string;
    category: string;
    price: number;
    provider: string;
  };
  hsaProvider: string;
  providerInfo: {
    name: string;
    npi?: string;
    address: string;
    phone: string;
    email: string;
  };
}

export class LMNGeneratorService {
  /**
   * Generate Letter of Medical Necessity from health questionnaire data
   */
  static async generateLMN(request: LMNGenerationRequest): Promise<LMNDocument> {
    const lmnData = this.prepareLMNData(request);
    const hsaProvider = HSAProviderService.getProvider(request.hsaProvider);
    
    if (!hsaProvider) {
      throw new Error(`HSA provider ${request.hsaProvider} not found`);
    }

    // Validate data against provider requirements
    const validation = HSAProviderService.validateLMNData(lmnData, request.hsaProvider);
    if (!validation.isValid) {
      throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
    }

    // Generate LMN content based on provider format
    const content = this.generateLMNContent(lmnData, hsaProvider);
    
    const lmnDocument: LMNDocument = {
      id: this.generateLMNId(),
      provider: request.hsaProvider,
      patientName: `${lmnData.patientInfo.firstName} ${lmnData.patientInfo.lastName}`,
      serviceName: request.serviceInfo.name,
      generatedDate: new Date().toISOString(),
      status: 'ready',
      content,
    };

    return lmnDocument;
  }

  /**
   * Prepare LMN data from health questionnaire
   */
  private static prepareLMNData(request: LMNGenerationRequest): LMNData {
    const { healthQuestionnaireData, serviceInfo, providerInfo } = request;

    // Get ICD-10 codes for the patient's conditions and service
    const icd10Codes = ICD10Service.getICD10CodesForService(
      serviceInfo.name,
      healthQuestionnaireData.selectedHealthConditions || []
    );

    // Get clinical rationale
    const clinicalRationale = ICD10Service.getClinicalRationale(
      serviceInfo.name,
      healthQuestionnaireData.selectedHealthConditions?.[0] || ''
    );

    return {
      patientInfo: {
        firstName: healthQuestionnaireData.firstName || '',
        lastName: healthQuestionnaireData.lastName || '',
        dateOfBirth: healthQuestionnaireData.dateOfBirth || '',
        sex: healthQuestionnaireData.sex || '',
        stateOfResidence: healthQuestionnaireData.stateOfResidence || '',
      },
      providerInfo: {
        name: providerInfo.name,
        npi: providerInfo.npi,
        address: providerInfo.address,
        phone: providerInfo.phone,
        email: providerInfo.email,
      },
      hsaInfo: {
        provider: healthQuestionnaireData.hsaProvider || '',
      },
      serviceInfo: {
        serviceName: serviceInfo.name,
        serviceDate: new Date().toISOString().split('T')[0],
        provider: serviceInfo.provider,
        cost: serviceInfo.price,
      },
      medicalInfo: {
        conditions: healthQuestionnaireData.selectedHealthConditions || [],
        icd10Codes,
        clinicalRationale,
        treatmentGoals: healthQuestionnaireData.treatmentGoals || '',
        preventionGoals: healthQuestionnaireData.preventionGoals || '',
        medicalHistory: healthQuestionnaireData.healthConditions || '',
      },
      attestation: {
        medicalNecessity: healthQuestionnaireData.medicalNecessityAttestation || false,
        attestationDate: new Date().toISOString(),
        providerSignature: providerInfo.name,
      },
    };
  }

  /**
   * Generate LMN content based on provider format
   */
  private static generateLMNContent(lmnData: LMNData, hsaProvider: HSAProvider): string {
    switch (hsaProvider.lmnFormat) {
      case 'custom':
        return this.generateCustomFormatLMN(lmnData, hsaProvider);
      case 'digital':
        return this.generateDigitalFormatLMN(lmnData, hsaProvider);
      case 'standard':
      default:
        return this.generateStandardFormatLMN(lmnData, hsaProvider);
    }
  }

  /**
   * Generate standard format LMN
   */
  private static generateStandardFormatLMN(lmnData: LMNData, hsaProvider: HSAProvider): string {
    const primaryICD10 = lmnData.medicalInfo.icd10Codes[0];
    
    return `
LETTER OF MEDICAL NECESSITY

Date: ${new Date().toLocaleDateString()}
To: ${hsaProvider.name} HSA Administration
From: ${lmnData.providerInfo.name}
Re: Medical Necessity for ${lmnData.serviceInfo.serviceName}

PATIENT INFORMATION:
Name: ${lmnData.patientInfo.firstName} ${lmnData.patientInfo.lastName}
Date of Birth: ${lmnData.patientInfo.dateOfBirth}
Sex: ${lmnData.patientInfo.sex}
State of Residence: ${lmnData.patientInfo.stateOfResidence}

PROVIDER INFORMATION:
Name: ${lmnData.providerInfo.name}
${lmnData.providerInfo.npi ? `NPI: ${lmnData.providerInfo.npi}` : ''}
Address: ${lmnData.providerInfo.address}
Phone: ${lmnData.providerInfo.phone}
Email: ${lmnData.providerInfo.email}

SERVICE INFORMATION:
Service: ${lmnData.serviceInfo.serviceName}
Service Date: ${lmnData.serviceInfo.serviceDate}
Cost: $${lmnData.serviceInfo.cost.toFixed(2)}

MEDICAL INFORMATION:
Primary Diagnosis: ${primaryICD10?.description || 'Not specified'}
ICD-10 Code(s): ${lmnData.medicalInfo.icd10Codes.map(code => code.icd10Code).join(', ')}
Medical Conditions: ${lmnData.medicalInfo.conditions.join(', ')}

CLINICAL RATIONALE:
${lmnData.medicalInfo.clinicalRationale}

ADDITIONAL MEDICAL HISTORY:
${lmnData.medicalInfo.medicalHistory}

TREATMENT GOALS:
${lmnData.medicalInfo.treatmentGoals}

PREVENTION GOALS:
${lmnData.medicalInfo.preventionGoals}

MEDICAL NECESSITY ATTESTATION:
I, ${lmnData.attestation.providerSignature}, hereby attest that:

1. The patient has been diagnosed with the medical condition(s) listed above
2. The requested service (${lmnData.serviceInfo.serviceName}) is medically necessary for the treatment of the diagnosed condition(s)
3. The service is not primarily for cosmetic purposes
4. The patient would not receive this service in the absence of the medical condition(s)
5. This request is consistent with medical necessity determination

Provider Signature: ${lmnData.attestation.providerSignature}
Date: ${new Date().toLocaleDateString()}

This letter of medical necessity is submitted to support HSA reimbursement for the above-referenced service.

Contact Information:
Phone: ${lmnData.providerInfo.phone}
Email: ${lmnData.providerInfo.email}

---
Generated by Automated LMN System
Provider: ${hsaProvider.name}
Generated: ${new Date().toISOString()}
    `.trim();
  }

  /**
   * Generate custom format LMN for specific providers
   */
  private static generateCustomFormatLMN(lmnData: LMNData, hsaProvider: HSAProvider): string {
    // Custom format for providers like WEX, Bank of America, etc.
    const primaryICD10 = lmnData.medicalInfo.icd10Codes[0];
    
    return `
MEDICAL NECESSITY DOCUMENTATION
${hsaProvider.name} HSA

Patient: ${lmnData.patientInfo.firstName} ${lmnData.patientInfo.lastName}
DOB: ${lmnData.patientInfo.dateOfBirth}
HSA Provider: ${lmnData.hsaInfo.provider}

Service Requested: ${lmnData.serviceInfo.serviceName}
Estimated Cost: $${lmnData.serviceInfo.cost.toFixed(2)}

Medical Diagnosis: ${primaryICD10?.description || 'Not specified'}
ICD-10 Code: ${primaryICD10?.icd10Code || 'Not specified'}

Clinical Justification:
${lmnData.medicalInfo.clinicalRationale}

Patient's Medical Conditions:
${lmnData.medicalInfo.conditions.join(', ')}

Treatment Rationale:
The requested service is medically necessary for the treatment and management of the patient's documented medical condition(s). This service addresses underlying dermatological pathology and supports the patient's overall health and well-being.

Provider: ${lmnData.providerInfo.name}
${lmnData.providerInfo.npi ? `NPI: ${lmnData.providerInfo.npi}` : ''}
Date: ${new Date().toLocaleDateString()}

Medical Necessity Certification:
I certify that the above service is medically necessary for the treatment of the patient's documented medical condition(s) and is not primarily for cosmetic purposes.

Signature: ${lmnData.attestation.providerSignature}
    `.trim();
  }

  /**
   * Generate digital format LMN for modern providers
   */
  private static generateDigitalFormatLMN(lmnData: LMNData, hsaProvider: HSAProvider): string {
    // Digital format for providers like Fidelity, Lively, Thatch
    const primaryICD10 = lmnData.medicalInfo.icd10Codes[0];
    
    return `
DIGITAL MEDICAL NECESSITY SUBMISSION
${hsaProvider.name} HSA Platform

PATIENT DATA:
• Name: ${lmnData.patientInfo.firstName} ${lmnData.patientInfo.lastName}
• DOB: ${lmnData.patientInfo.dateOfBirth}
• Gender: ${lmnData.patientInfo.sex}
• Location: ${lmnData.patientInfo.stateOfResidence}

SERVICE DETAILS:
• Service: ${lmnData.serviceInfo.serviceName}
• Date: ${lmnData.serviceInfo.serviceDate}
• Cost: $${lmnData.serviceInfo.cost.toFixed(2)}

MEDICAL JUSTIFICATION:
• Primary Diagnosis: ${primaryICD10?.description || 'Not specified'}
• ICD-10 Code: ${primaryICD10?.icd10Code || 'Not specified'}
• Related Conditions: ${lmnData.medicalInfo.conditions.join(', ')}

CLINICAL RATIONALE:
${lmnData.medicalInfo.clinicalRationale}

TREATMENT OBJECTIVES:
• Primary Goal: ${lmnData.medicalInfo.treatmentGoals}
• Prevention Focus: ${lmnData.medicalInfo.preventionGoals}

PROVIDER CERTIFICATION:
Provider: ${lmnData.providerInfo.name}
${lmnData.providerInfo.npi ? `NPI: ${lmnData.providerInfo.npi}` : ''}
Certification Date: ${new Date().toISOString()}

I certify that this service is medically necessary for the documented condition(s) and meets HSA eligibility requirements.

Digital Signature: ${lmnData.attestation.providerSignature}
    `.trim();
  }

  /**
   * Generate unique LMN ID
   */
  private static generateLMNId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `LMN-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Submit LMN to HSA provider
   */
  static async submitLMN(lmnDocument: LMNDocument): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    const hsaProvider = HSAProviderService.getProvider(lmnDocument.provider);
    
    if (!hsaProvider) {
      return { success: false, error: 'HSA provider not found' };
    }

    try {
      if (hsaProvider.digitalSubmission && hsaProvider.apiEndpoint) {
        // Digital submission via API
        return await this.submitViaAPI(lmnDocument, hsaProvider);
      } else {
        // Traditional submission (PDF upload, email, etc.)
        return await this.submitTraditionally(lmnDocument, hsaProvider);
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Submission failed' 
      };
    }
  }

  /**
   * Submit LMN via API
   */
  private static async submitViaAPI(lmnDocument: LMNDocument, hsaProvider: HSAProvider): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    // This would integrate with actual HSA provider APIs
    // For now, simulate successful submission
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      success: true,
      submissionId,
    };
  }

  /**
   * Submit LMN traditionally (PDF, email, etc.)
   */
  private static async submitTraditionally(lmnDocument: LMNDocument, hsaProvider: HSAProvider): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    // This would handle PDF generation and submission
    // For now, simulate successful submission
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      success: true,
      submissionId,
    };
  }

  /**
   * Get LMN status from HSA provider
   */
  static async getLMNStatus(lmnDocument: LMNDocument): Promise<{ status: string; details?: any }> {
    // This would query the HSA provider for status updates
    // For now, return mock status
    return {
      status: 'approved',
      details: {
        approvalDate: new Date().toISOString(),
        approvalAmount: lmnDocument.serviceInfo.cost,
      },
    };
  }
}

export default LMNGeneratorService;
