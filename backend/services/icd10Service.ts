/**
 * ICD-10 Code Mapping Service
 * Maps health conditions and services to appropriate ICD-10 codes for medical necessity documentation
 */

export interface ICD10Mapping {
  condition: string;
  icd10Code: string;
  description: string;
  category: string;
  serviceTypes: string[];
}

export interface ServiceICD10Mapping {
  service: string;
  serviceCategory: string;
  applicableConditions: ICD10Mapping[];
  clinicalRationale: string;
}

// ICD-10 codes for common dermatological and aesthetic conditions
const ICD10_MAPPINGS: ICD10Mapping[] = [
  // Acne and related conditions
  {
    condition: "Acne and skin conditions",
    icd10Code: "L70.9",
    description: "Acne vulgaris, unspecified",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel", "microneedling"]
  },
  {
    condition: "Acne and skin conditions",
    icd10Code: "L70.1",
    description: "Acne conglobata",
    category: "dermatology", 
    serviceTypes: ["laser_treatment", "chemical_peel"]
  },
  {
    condition: "Acne and skin conditions",
    icd10Code: "L70.2",
    description: "Acne varioliformis",
    category: "dermatology",
    serviceTypes: ["laser_treatment"]
  },

  // Hair removal concerns
  {
    condition: "Hair removal concerns",
    icd10Code: "L68.9",
    description: "Hypertrichosis, unspecified",
    category: "dermatology",
    serviceTypes: ["laser_hair_removal"]
  },
  {
    condition: "Hair removal concerns", 
    icd10Code: "L68.1",
    description: "Hirsutism",
    category: "dermatology",
    serviceTypes: ["laser_hair_removal"]
  },
  {
    condition: "Hair removal concerns",
    icd10Code: "Q84.2",
    description: "Other congenital malformations of skin",
    category: "congenital",
    serviceTypes: ["laser_hair_removal"]
  },

  // Anti-aging treatments
  {
    condition: "Anti-aging treatments",
    icd10Code: "L57.9",
    description: "Actinic changes, unspecified",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel", "microneedling", "botox"]
  },
  {
    condition: "Anti-aging treatments",
    icd10Code: "L57.0",
    description: "Actinic keratosis",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel"]
  },
  {
    condition: "Anti-aging treatments",
    icd10Code: "L90.8",
    description: "Other atrophic disorders of skin",
    category: "dermatology",
    serviceTypes: ["microneedling", "laser_treatment"]
  },

  // Skin texture issues
  {
    condition: "Skin texture issues",
    icd10Code: "L81.9",
    description: "Disorder of pigmentation, unspecified",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel", "microneedling"]
  },
  {
    condition: "Skin texture issues",
    icd10Code: "L70.8",
    description: "Other acne",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel", "microneedling"]
  },

  // Pigmentation problems
  {
    condition: "Pigmentation problems",
    icd10Code: "L81.1",
    description: "Chloasma",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel"]
  },
  {
    condition: "Pigmentation problems",
    icd10Code: "L81.0",
    description: "Postinflammatory hyperpigmentation",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel", "microneedling"]
  },
  {
    condition: "Pigmentation problems",
    icd10Code: "L81.2",
    description: "Freckles",
    category: "dermatology",
    serviceTypes: ["laser_treatment"]
  },

  // Scar treatment
  {
    condition: "Scar treatment",
    icd10Code: "L90.5",
    description: "Scar conditions and fibrosis of skin",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "microneedling", "chemical_peel"]
  },
  {
    condition: "Scar treatment",
    icd10Code: "L91.0",
    description: "Hypertrophic scar",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "microneedling"]
  },
  {
    condition: "Scar treatment",
    icd10Code: "L91.1",
    description: "Keloid scar",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "microneedling"]
  },

  // Rosacea
  {
    condition: "Rosacea",
    icd10Code: "L71.9",
    description: "Rosacea, unspecified",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel"]
  },
  {
    condition: "Rosacea",
    icd10Code: "L71.1",
    description: "Rhinophyma",
    category: "dermatology",
    serviceTypes: ["laser_treatment"]
  },
  {
    condition: "Rosacea",
    icd10Code: "L71.0",
    description: "Perioral dermatitis",
    category: "dermatology",
    serviceTypes: ["laser_treatment", "chemical_peel"]
  }
];

// Service-specific mappings
const SERVICE_MAPPINGS: ServiceICD10Mapping[] = [
  {
    service: "Laser Hair Removal",
    serviceCategory: "laser_hair_removal",
    applicableConditions: ICD10_MAPPINGS.filter(m => m.serviceTypes.includes("laser_hair_removal")),
    clinicalRationale: "Laser hair removal is medically necessary for the treatment of hypertrichosis and hirsutism, which can cause significant psychological distress and social impairment. The procedure reduces unwanted hair growth and improves quality of life."
  },
  {
    service: "Laser Skin Treatment",
    serviceCategory: "laser_treatment",
    applicableConditions: ICD10_MAPPINGS.filter(m => m.serviceTypes.includes("laser_treatment")),
    clinicalRationale: "Laser treatment is medically necessary for the treatment of various dermatological conditions including acne, rosacea, pigmentation disorders, and actinic keratosis. The procedure addresses underlying skin pathology and prevents progression of disease."
  },
  {
    service: "Chemical Peel",
    serviceCategory: "chemical_peel",
    applicableConditions: ICD10_MAPPINGS.filter(m => m.serviceTypes.includes("chemical_peel")),
    clinicalRationale: "Chemical peel treatment is medically necessary for the treatment of acne, hyperpigmentation, actinic keratosis, and other skin conditions. The procedure promotes skin renewal and addresses underlying dermatological pathology."
  },
  {
    service: "Microneedling",
    serviceCategory: "microneedling",
    applicableConditions: ICD10_MAPPINGS.filter(m => m.serviceTypes.includes("microneedling")),
    clinicalRationale: "Microneedling is medically necessary for the treatment of acne scars, skin texture irregularities, and atrophic skin conditions. The procedure stimulates collagen production and improves skin structure."
  },
  {
    service: "Botox Treatment",
    serviceCategory: "botox",
    applicableConditions: ICD10_MAPPINGS.filter(m => m.serviceTypes.includes("botox")),
    clinicalRationale: "Botox treatment is medically necessary for the management of chronic facial muscle tension and associated discomfort from actinic changes and aging-related skin conditions."
  }
];

export class ICD10Service {
  /**
   * Get ICD-10 codes for a specific condition
   */
  static getICD10CodesForCondition(condition: string): ICD10Mapping[] {
    return ICD10_MAPPINGS.filter(mapping => 
      mapping.condition.toLowerCase() === condition.toLowerCase()
    );
  }

  /**
   * Get ICD-10 codes for a specific service
   */
  static getICD10CodesForService(serviceName: string, conditions: string[]): ICD10Mapping[] {
    const serviceMapping = SERVICE_MAPPINGS.find(mapping => 
      mapping.service.toLowerCase().includes(serviceName.toLowerCase()) ||
      mapping.serviceCategory.toLowerCase().includes(serviceName.toLowerCase())
    );

    if (!serviceMapping) {
      return [];
    }

    // Filter conditions that are applicable to this service
    return serviceMapping.applicableConditions.filter(condition => 
      conditions.some(userCondition => 
        userCondition.toLowerCase() === condition.condition.toLowerCase()
      )
    );
  }

  /**
   * Get clinical rationale for a service and condition combination
   */
  static getClinicalRationale(serviceName: string, condition: string): string {
    const serviceMapping = SERVICE_MAPPINGS.find(mapping => 
      mapping.service.toLowerCase().includes(serviceName.toLowerCase()) ||
      mapping.serviceCategory.toLowerCase().includes(serviceName.toLowerCase())
    );

    if (!serviceMapping) {
      return "The requested service is medically necessary for the treatment of the documented condition.";
    }

    return serviceMapping.clinicalRationale;
  }

  /**
   * Get primary ICD-10 code for a condition (first/most common code)
   */
  static getPrimaryICD10Code(condition: string): ICD10Mapping | null {
    const codes = this.getICD10CodesForCondition(condition);
    return codes.length > 0 ? codes[0] : null;
  }

  /**
   * Get all available conditions
   */
  static getAllConditions(): string[] {
    return [...new Set(ICD10_MAPPINGS.map(mapping => mapping.condition))];
  }

  /**
   * Get all available services
   */
  static getAllServices(): ServiceICD10Mapping[] {
    return SERVICE_MAPPINGS;
  }

  /**
   * Validate if a condition-service combination is medically justified
   */
  static isMedicallyJustified(condition: string, serviceName: string): boolean {
    const serviceMapping = SERVICE_MAPPINGS.find(mapping => 
      mapping.service.toLowerCase().includes(serviceName.toLowerCase()) ||
      mapping.serviceCategory.toLowerCase().includes(serviceName.toLowerCase())
    );

    if (!serviceMapping) {
      return false;
    }

    return serviceMapping.applicableConditions.some(applicableCondition =>
      applicableCondition.condition.toLowerCase() === condition.toLowerCase()
    );
  }
}

export default ICD10Service;
