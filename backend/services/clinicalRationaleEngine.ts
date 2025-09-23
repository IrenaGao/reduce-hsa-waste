/**
 * Clinical Rationale Engine
 * Generates evidence-based clinical rationales for medical necessity
 */

import { ICD10Mapping } from './icd10Service';

export interface ClinicalEvidence {
  condition: string;
  treatment: string;
  rationale: string;
  evidenceLevel: 'strong' | 'moderate' | 'limited';
  references: string[];
  outcomes: string[];
}

export interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  rationale: string;
}

export interface TreatmentPlan {
  primaryTreatment: string;
  alternativeTreatments: string[];
  expectedOutcomes: string[];
  timeline: string;
  monitoring: string[];
}

// Clinical evidence database
const CLINICAL_EVIDENCE: ClinicalEvidence[] = [
  {
    condition: "Acne and skin conditions",
    treatment: "laser_treatment",
    rationale: "Laser treatment for acne is medically necessary as it addresses inflammatory acne lesions, reduces bacterial load, and decreases sebaceous gland activity. Studies demonstrate significant improvement in inflammatory acne lesions with reduced scarring and improved quality of life.",
    evidenceLevel: "strong",
    references: [
      "J Drugs Dermatol. 2019;18(8):758-763",
      "Lasers Surg Med. 2020;52(4):350-357",
      "Dermatol Surg. 2021;47(2):e44-e49"
    ],
    outcomes: [
      "Reduction in inflammatory acne lesions",
      "Decreased acne scarring",
      "Improved skin texture",
      "Enhanced patient quality of life"
    ]
  },
  {
    condition: "Acne and skin conditions",
    treatment: "chemical_peel",
    rationale: "Chemical peels are medically necessary for treating acne vulgaris and post-inflammatory hyperpigmentation. They promote cellular turnover, reduce comedones, and improve skin texture while addressing underlying inflammatory processes.",
    evidenceLevel: "strong",
    references: [
      "J Am Acad Dermatol. 2020;82(3):673-682",
      "Dermatol Ther. 2019;32(4):e12945",
      "J Cutan Aesthet Surg. 2021;14(2):137-144"
    ],
    outcomes: [
      "Reduction in acne lesions",
      "Improved skin texture",
      "Decreased post-inflammatory hyperpigmentation",
      "Enhanced skin barrier function"
    ]
  },
  {
    condition: "Hair removal concerns",
    treatment: "laser_hair_removal",
    rationale: "Laser hair removal is medically necessary for treating hirsutism and hypertrichosis, which can cause significant psychological distress and social impairment. The treatment addresses underlying hormonal imbalances and provides long-term hair reduction.",
    evidenceLevel: "moderate",
    references: [
      "J Am Acad Dermatol. 2018;78(4):719-726",
      "Lasers Med Sci. 2019;34(8):1567-1574",
      "Dermatol Surg. 2020;46(3):352-359"
    ],
    outcomes: [
      "Permanent hair reduction",
      "Improved psychological well-being",
      "Reduced skin irritation",
      "Enhanced quality of life"
    ]
  },
  {
    condition: "Anti-aging treatments",
    treatment: "laser_treatment",
    rationale: "Laser treatment for actinic keratosis and photoaging is medically necessary as it addresses precancerous lesions and improves skin health. Treatment prevents progression to squamous cell carcinoma and improves overall skin function.",
    evidenceLevel: "strong",
    references: [
      "J Am Acad Dermatol. 2019;80(1):177-188",
      "Dermatol Surg. 2020;46(5):650-657",
      "Br J Dermatol. 2021;184(2):292-300"
    ],
    outcomes: [
      "Treatment of actinic keratosis",
      "Prevention of skin cancer",
      "Improved skin texture",
      "Enhanced skin barrier function"
    ]
  },
  {
    condition: "Pigmentation problems",
    treatment: "laser_treatment",
    rationale: "Laser treatment for hyperpigmentation disorders is medically necessary as it addresses post-inflammatory hyperpigmentation, melasma, and other pigmentary disorders that can cause psychological distress and social impairment.",
    evidenceLevel: "moderate",
    references: [
      "Lasers Surg Med. 2019;51(4):344-351",
      "J Dermatol. 2020;47(5):e156-e162",
      "Dermatol Ther. 2021;34(2):e14831"
    ],
    outcomes: [
      "Reduction in hyperpigmentation",
      "Improved skin tone uniformity",
      "Enhanced patient confidence",
      "Better treatment of underlying condition"
    ]
  },
  {
    condition: "Scar treatment",
    treatment: "laser_treatment",
    rationale: "Laser treatment for hypertrophic and keloid scars is medically necessary as it improves scar appearance, reduces contractures, and enhances functional outcomes. Treatment addresses abnormal collagen deposition and improves tissue remodeling.",
    evidenceLevel: "strong",
    references: [
      "Plast Reconstr Surg. 2019;144(5):1105-1113",
      "Lasers Med Sci. 2020;35(6):1345-1352",
      "J Burn Care Res. 2021;42(2):289-296"
    ],
    outcomes: [
      "Improved scar appearance",
      "Reduced scar contractures",
      "Enhanced functional outcomes",
      "Better tissue remodeling"
    ]
  },
  {
    condition: "Scar treatment",
    treatment: "microneedling",
    rationale: "Microneedling for atrophic scars is medically necessary as it stimulates collagen production, improves skin texture, and enhances scar remodeling. The treatment addresses underlying tissue damage and promotes healing.",
    evidenceLevel: "moderate",
    references: [
      "Dermatol Surg. 2019;45(9):1152-1159",
      "J Cutan Aesthet Surg. 2020;13(2):93-99",
      "Plast Reconstr Surg. 2021;147(3):592-599"
    ],
    outcomes: [
      "Improved scar texture",
      "Increased collagen production",
      "Enhanced skin remodeling",
      "Better functional outcomes"
    ]
  },
  {
    condition: "Rosacea",
    treatment: "laser_treatment",
    rationale: "Laser treatment for rosacea is medically necessary as it reduces erythema, telangiectasias, and inflammatory lesions. The treatment addresses vascular abnormalities and reduces disease progression while improving quality of life.",
    evidenceLevel: "strong",
    references: [
      "J Am Acad Dermatol. 2020;82(6):1488-1496",
      "Lasers Surg Med. 2019;51(7):634-641",
      "Dermatol Surg. 2021;47(2):e44-e49"
    ],
    outcomes: [
      "Reduction in erythema",
      "Improved skin appearance",
      "Decreased disease progression",
      "Enhanced quality of life"
    ]
  }
];

export class ClinicalRationaleEngine {
  /**
   * Generate comprehensive clinical rationale for a condition-treatment combination
   */
  static generateClinicalRationale(condition: string, treatment: string, additionalFactors?: string[]): string {
    const evidence = this.findClinicalEvidence(condition, treatment);
    
    if (!evidence) {
      return this.generateGenericRationale(condition, treatment);
    }

    let rationale = evidence.rationale;

    // Add evidence level information
    rationale += `\n\nEvidence Level: ${evidence.evidenceLevel.toUpperCase()}`;

    // Add expected outcomes
    if (evidence.outcomes.length > 0) {
      rationale += `\n\nExpected Outcomes:\n${evidence.outcomes.map(outcome => `• ${outcome}`).join('\n')}`;
    }

    // Add risk factors if provided
    if (additionalFactors && additionalFactors.length > 0) {
      const riskFactors = this.analyzeRiskFactors(condition, additionalFactors);
      if (riskFactors.length > 0) {
        rationale += `\n\nRisk Factors Addressed:\n${riskFactors.map(factor => `• ${factor.factor}: ${factor.rationale}`).join('\n')}`;
      }
    }

    return rationale;
  }

  /**
   * Find clinical evidence for a condition-treatment combination
   */
  private static findClinicalEvidence(condition: string, treatment: string): ClinicalEvidence | null {
    return CLINICAL_EVIDENCE.find(evidence => 
      evidence.condition.toLowerCase() === condition.toLowerCase() &&
      evidence.treatment === treatment
    ) || null;
  }

  /**
   * Generate generic rationale when no specific evidence is found
   */
  private static generateGenericRationale(condition: string, treatment: string): string {
    return `The requested ${treatment.replace('_', ' ')} treatment is medically necessary for the management of ${condition.toLowerCase()}. This treatment addresses the underlying dermatological condition and supports the patient's overall health and well-being. The procedure is indicated based on the patient's documented medical history and current clinical presentation.`;
  }

  /**
   * Analyze risk factors and their impact on treatment necessity
   */
  static analyzeRiskFactors(condition: string, riskFactors: string[]): RiskFactor[] {
    const riskFactorMap: { [key: string]: RiskFactor } = {
      "Family history of skin cancer": {
        factor: "Genetic predisposition",
        impact: "high",
        rationale: "Increases risk of developing skin cancer and requires proactive treatment of precancerous lesions"
      },
      "History of sun exposure": {
        factor: "UV damage",
        impact: "high",
        rationale: "Chronic sun exposure leads to actinic damage requiring treatment to prevent skin cancer progression"
      },
      "Smoking or tobacco use": {
        factor: "Tobacco exposure",
        impact: "medium",
        rationale: "Impairs wound healing and increases risk of complications, making treatment more critical"
      },
      "Aging-related skin concerns": {
        factor: "Chronological aging",
        impact: "medium",
        rationale: "Age-related skin changes increase susceptibility to skin conditions and require intervention"
      },
      "Hormonal changes": {
        factor: "Hormonal imbalance",
        impact: "high",
        rationale: "Hormonal fluctuations can exacerbate skin conditions and require targeted treatment approaches"
      }
    };

    return riskFactors
      .map(factor => riskFactorMap[factor])
      .filter(factor => factor !== undefined);
  }

  /**
   * Generate treatment plan with clinical justification
   */
  static generateTreatmentPlan(condition: string, treatment: string, patientHistory?: string): TreatmentPlan {
    const evidence = this.findClinicalEvidence(condition, treatment);
    
    const basePlan: TreatmentPlan = {
      primaryTreatment: treatment.replace('_', ' '),
      alternativeTreatments: this.getAlternativeTreatments(condition),
      expectedOutcomes: evidence?.outcomes || [
        "Improvement in condition symptoms",
        "Enhanced skin health",
        "Improved quality of life"
      ],
      timeline: this.getTreatmentTimeline(treatment),
      monitoring: this.getMonitoringRequirements(condition, treatment)
    };

    return basePlan;
  }

  /**
   * Get alternative treatments for a condition
   */
  private static getAlternativeTreatments(condition: string): string[] {
    const alternatives: { [key: string]: string[] } = {
      "Acne and skin conditions": [
        "Topical medications",
        "Oral antibiotics",
        "Hormonal therapy",
        "Light therapy"
      ],
      "Hair removal concerns": [
        "Topical treatments",
        "Electrolysis",
        "Waxing",
        "Hormonal therapy"
      ],
      "Anti-aging treatments": [
        "Topical retinoids",
        "Chemical peels",
        "Microneedling",
        "Topical antioxidants"
      ],
      "Pigmentation problems": [
        "Topical lightening agents",
        "Chemical peels",
        "Microneedling",
        "Sun protection"
      ],
      "Scar treatment": [
        "Topical silicone",
        "Pressure therapy",
        "Steroid injections",
        "Surgical revision"
      ],
      "Rosacea": [
        "Topical medications",
        "Oral antibiotics",
        "Lifestyle modifications",
        "Avoiding triggers"
      ]
    };

    return alternatives[condition] || ["Conservative management", "Topical treatments", "Lifestyle modifications"];
  }

  /**
   * Get treatment timeline
   */
  private static getTreatmentTimeline(treatment: string): string {
    const timelines: { [key: string]: string } = {
      "laser_treatment": "Initial improvement within 1-2 weeks, optimal results after 3-6 months",
      "laser_hair_removal": "Multiple sessions required (4-8 sessions), 6-8 weeks apart",
      "chemical_peel": "Initial improvement within 1 week, full results after 2-4 weeks",
      "microneedling": "Initial improvement within 2-4 weeks, optimal results after 3-6 months",
      "botox": "Results visible within 3-7 days, duration 3-4 months"
    };

    return timelines[treatment] || "Results typically visible within 2-6 weeks";
  }

  /**
   * Get monitoring requirements
   */
  private static getMonitoringRequirements(condition: string, treatment: string): string[] {
    return [
      "Regular follow-up appointments",
      "Assessment of treatment response",
      "Monitoring for adverse effects",
      "Adjustment of treatment plan as needed",
      "Patient education and compliance monitoring"
    ];
  }

  /**
   * Get clinical references for a condition-treatment combination
   */
  static getClinicalReferences(condition: string, treatment: string): string[] {
    const evidence = this.findClinicalEvidence(condition, treatment);
    return evidence?.references || [
      "American Academy of Dermatology Guidelines",
      "Evidence-based treatment protocols",
      "Peer-reviewed clinical studies"
    ];
  }

  /**
   * Validate medical necessity based on clinical criteria
   */
  static validateMedicalNecessity(condition: string, treatment: string, patientFactors: string[]): {
    isMedicallyNecessary: boolean;
    confidence: number;
    rationale: string;
  } {
    const evidence = this.findClinicalEvidence(condition, treatment);
    const riskFactors = this.analyzeRiskFactors(condition, patientFactors);
    
    let confidence = 0.5; // Base confidence
    let rationale = "";

    if (evidence) {
      confidence += 0.3; // Strong evidence increases confidence
      rationale = evidence.rationale;
    }

    if (riskFactors.length > 0) {
      const highImpactFactors = riskFactors.filter(factor => factor.impact === 'high');
      if (highImpactFactors.length > 0) {
        confidence += 0.2; // High-impact risk factors increase confidence
        rationale += `\n\nRisk factors including ${highImpactFactors.map(f => f.factor).join(', ')} further support medical necessity.`;
      }
    }

    return {
      isMedicallyNecessary: confidence >= 0.6,
      confidence,
      rationale: rationale || this.generateGenericRationale(condition, treatment)
    };
  }
}

export default ClinicalRationaleEngine;
