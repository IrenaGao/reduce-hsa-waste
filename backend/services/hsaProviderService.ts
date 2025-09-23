/**
 * HSA Provider Service
 * Handles different HSA provider requirements and LMN formats
 */

import { ICD10Mapping } from './icd10Service';

export interface HSAProvider {
  name: string;
  code: string;
  lmnRequired: boolean;
  lmnFormat: 'standard' | 'custom' | 'digital';
  requiredFields: string[];
  digitalSubmission: boolean;
  apiEndpoint?: string;
  templateUrl?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface LMNRequirements {
  provider: HSAProvider;
  requiredFields: string[];
  format: 'pdf' | 'digital' | 'both';
  submissionMethod: 'upload' | 'api' | 'email' | 'fax';
  additionalRequirements: string[];
}

export interface LMNData {
  patientInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    sex: string;
    stateOfResidence: string;
  };
  providerInfo: {
    name: string;
    npi?: string;
    address: string;
    phone: string;
    email: string;
  };
  hsaInfo: {
    provider: string;
    memberId?: string;
    groupId?: string;
  };
  serviceInfo: {
    serviceName: string;
    serviceDate: string;
    provider: string;
    cost: number;
  };
  medicalInfo: {
    conditions: string[];
    icd10Codes: ICD10Mapping[];
    clinicalRationale: string;
    treatmentGoals: string;
    preventionGoals: string;
    medicalHistory: string;
  };
  attestation: {
    medicalNecessity: boolean;
    attestationDate: string;
    providerSignature: string;
  };
}

// HSA Provider configurations
const HSA_PROVIDERS: HSAProvider[] = [
  {
    name: 'HealthEquity',
    code: 'healthequity',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.healthequity.com/lmn',
    contactInfo: {
      phone: '866-346-5800',
      email: 'support@healthequity.com',
      website: 'https://www.healthequity.com'
    }
  },
  {
    name: 'WEX',
    code: 'wex',
    lmnRequired: true,
    lmnFormat: 'custom',
    requiredFields: ['patient_info', 'service_details', 'medical_necessity', 'provider_info', 'attestation'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.wexinc.com/hsa/lmn',
    contactInfo: {
      phone: '877-934-6389',
      email: 'hsasupport@wexinc.com',
      website: 'https://www.wexinc.com'
    }
  },
  {
    name: 'Optum',
    code: 'optum',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature', 'npi'],
    digitalSubmission: false,
    contactInfo: {
      phone: '866-234-8913',
      email: 'hsasupport@optum.com',
      website: 'https://www.optum.com'
    }
  },
  {
    name: 'Bank of America',
    code: 'bofa',
    lmnRequired: true,
    lmnFormat: 'custom',
    requiredFields: ['patient_info', 'service_details', 'medical_necessity', 'provider_info'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.bankofamerica.com/hsa/lmn',
    contactInfo: {
      phone: '877-859-7860',
      email: 'hsasupport@bankofamerica.com',
      website: 'https://www.bankofamerica.com'
    }
  },
  {
    name: 'Fidelity',
    code: 'fidelity',
    lmnRequired: true,
    lmnFormat: 'digital',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.fidelity.com/hsa/lmn',
    contactInfo: {
      phone: '800-544-3716',
      email: 'hsasupport@fidelity.com',
      website: 'https://www.fidelity.com'
    }
  },
  {
    name: 'FSAFEDS',
    code: 'fsafeds',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature'],
    digitalSubmission: true,
    contactInfo: {
      phone: '877-372-3337',
      email: 'fsafeds@fsafeds.com',
      website: 'https://www.fsafeds.com'
    }
  },
  {
    name: 'HealthTrust',
    code: 'healthtrust',
    lmnRequired: true,
    lmnFormat: 'custom',
    requiredFields: ['patient_info', 'service_details', 'medical_necessity', 'provider_info'],
    digitalSubmission: false,
    contactInfo: {
      phone: '800-842-6590',
      email: 'support@healthtrust.com',
      website: 'https://www.healthtrust.com'
    }
  },
  {
    name: 'Navia',
    code: 'navia',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature'],
    digitalSubmission: true,
    contactInfo: {
      phone: '800-669-3539',
      email: 'support@naviabenefits.com',
      website: 'https://www.naviabenefits.com'
    }
  },
  {
    name: 'Lively',
    code: 'lively',
    lmnRequired: true,
    lmnFormat: 'digital',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.livelyme.com/hsa/lmn',
    contactInfo: {
      phone: '888-798-8380',
      email: 'support@livelyme.com',
      website: 'https://www.livelyme.com'
    }
  },
  {
    name: 'Thatch',
    code: 'thatch',
    lmnRequired: true,
    lmnFormat: 'digital',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale'],
    digitalSubmission: true,
    apiEndpoint: 'https://api.thatch.com/hsa/lmn',
    contactInfo: {
      phone: '855-842-8224',
      email: 'support@thatch.com',
      website: 'https://www.thatch.com'
    }
  },
  {
    name: 'P&A Group',
    code: 'pa_group',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature'],
    digitalSubmission: false,
    contactInfo: {
      phone: '800-688-2611',
      email: 'support@pagroup.com',
      website: 'https://www.pagroup.com'
    }
  },
  {
    name: 'PIOPAC Fidelity',
    code: 'piopac_fidelity',
    lmnRequired: true,
    lmnFormat: 'standard',
    requiredFields: ['patient_name', 'dob', 'service_description', 'icd10_code', 'clinical_rationale', 'provider_signature'],
    digitalSubmission: true,
    contactInfo: {
      phone: '800-544-3716',
      email: 'piopac@fidelity.com',
      website: 'https://www.fidelity.com'
    }
  },
  {
    name: 'Melody Benefit',
    code: 'melody_benefit',
    lmnRequired: true,
    lmnFormat: 'custom',
    requiredFields: ['patient_info', 'service_details', 'medical_necessity', 'provider_info'],
    digitalSubmission: false,
    contactInfo: {
      phone: '800-880-8880',
      email: 'support@melodybenefit.com',
      website: 'https://www.melodybenefit.com'
    }
  }
];

export class HSAProviderService {
  /**
   * Get HSA provider by name or code
   */
  static getProvider(providerName: string): HSAProvider | null {
    return HSA_PROVIDERS.find(provider => 
      provider.name.toLowerCase() === providerName.toLowerCase() ||
      provider.code.toLowerCase() === providerName.toLowerCase()
    ) || null;
  }

  /**
   * Get all available HSA providers
   */
  static getAllProviders(): HSAProvider[] {
    return HSA_PROVIDERS;
  }

  /**
   * Get LMN requirements for a specific provider
   */
  static getLMNRequirements(providerName: string): LMNRequirements | null {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return null;
    }

    return {
      provider,
      requiredFields: provider.requiredFields,
      format: provider.digitalSubmission ? 'both' : 'pdf',
      submissionMethod: provider.digitalSubmission ? 'api' : 'upload',
      additionalRequirements: this.getAdditionalRequirements(provider.code)
    };
  }

  /**
   * Get additional requirements for specific providers
   */
  private static getAdditionalRequirements(providerCode: string): string[] {
    const requirements: { [key: string]: string[] } = {
      'healthequity': [
        'Provider NPI number required',
        'Service must be performed by licensed healthcare provider',
        'Clinical documentation must support medical necessity'
      ],
      'wex': [
        'Detailed clinical rationale required',
        'Treatment plan documentation',
        'Provider license verification'
      ],
      'optum': [
        'Provider NPI number required',
        'Detailed clinical documentation',
        'Treatment goals and outcomes'
      ],
      'bofa': [
        'Service provider verification',
        'Clinical justification documentation',
        'Treatment timeline'
      ],
      'fidelity': [
        'Digital submission preferred',
        'Automated validation available',
        'Real-time status updates'
      ],
      'lively': [
        'Digital-first approach',
        'API integration available',
        'Automated processing'
      ],
      'thatch': [
        'Modern digital platform',
        'API integration available',
        'Automated validation'
      ]
    };

    return requirements[providerCode] || [
      'Standard medical necessity documentation required',
      'Provider signature required',
      'Clinical rationale must be provided'
    ];
  }

  /**
   * Check if provider supports digital submission
   */
  static supportsDigitalSubmission(providerName: string): boolean {
    const provider = this.getProvider(providerName);
    return provider?.digitalSubmission || false;
  }

  /**
   * Get submission method for provider
   */
  static getSubmissionMethod(providerName: string): 'upload' | 'api' | 'email' | 'fax' {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return 'upload';
    }

    if (provider.digitalSubmission && provider.apiEndpoint) {
      return 'api';
    }

    if (provider.digitalSubmission) {
      return 'email';
    }

    return 'upload';
  }

  /**
   * Get provider contact information
   */
  static getContactInfo(providerName: string) {
    const provider = this.getProvider(providerName);
    return provider?.contactInfo || null;
  }

  /**
   * Validate LMN data against provider requirements
   */
  static validateLMNData(lmnData: LMNData, providerName: string): { isValid: boolean; missingFields: string[] } {
    const requirements = this.getLMNRequirements(providerName);
    if (!requirements) {
      return { isValid: false, missingFields: ['Provider not found'] };
    }

    const missingFields: string[] = [];

    // Check required fields
    if (requirements.requiredFields.includes('patient_name') && !lmnData.patientInfo.firstName) {
      missingFields.push('Patient first name');
    }
    if (requirements.requiredFields.includes('patient_name') && !lmnData.patientInfo.lastName) {
      missingFields.push('Patient last name');
    }
    if (requirements.requiredFields.includes('dob') && !lmnData.patientInfo.dateOfBirth) {
      missingFields.push('Patient date of birth');
    }
    if (requirements.requiredFields.includes('service_description') && !lmnData.serviceInfo.serviceName) {
      missingFields.push('Service description');
    }
    if (requirements.requiredFields.includes('icd10_code') && (!lmnData.medicalInfo.icd10Codes || lmnData.medicalInfo.icd10Codes.length === 0)) {
      missingFields.push('ICD-10 diagnosis code');
    }
    if (requirements.requiredFields.includes('clinical_rationale') && !lmnData.medicalInfo.clinicalRationale) {
      missingFields.push('Clinical rationale');
    }
    if (requirements.requiredFields.includes('provider_signature') && !lmnData.attestation.providerSignature) {
      missingFields.push('Provider signature');
    }
    if (requirements.requiredFields.includes('npi') && !lmnData.providerInfo.npi) {
      missingFields.push('Provider NPI number');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }
}

export default HSAProviderService;
