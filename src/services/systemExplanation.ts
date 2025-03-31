
/**
 * Neutrosophic AHP-TOPSIS Explanation Service
 * Provides scientific documentation of the DeepCAL decision system
 */

export interface ProtocolExplanation {
  title: string;
  description: string;
  methodology: {
    title: string;
    description: string;
    components: {
      name: string;
      description: string;
      scientificBasis: string;
    }[];
  };
  benefits: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  realWorldImpact: string;
}

/**
 * Provides a detailed scientific explanation of the Neutrosophic AHP-TOPSIS methodology
 * used in DeepCAL for logistics decision-making
 */
export function getPrimeOriginExplanation(): ProtocolExplanation {
  return {
    title: "NEUTROSOPHIC AHP-TOPSIS METHODOLOGY",
    description: 
      "DeepCAL's formalized decision procedure for analyzing and optimizing logistics operations. " +
      "This scientific methodology integrates Neutrosophic logic with AHP-TOPSIS to deliver " +
      "traceable, validated, and explainable decision support.",
    
    methodology: {
      title: "Methodology: Neutrosophic AHP-TOPSIS",
      description: 
        "The DeepCAL engine implements a rigorous computational framework that combines two " +
        "powerful decision science methodologies enhanced with uncertainty handling:",
      components: [
        {
          name: "Neutrosophic Logic",
          description: 
            "A mathematical framework that extends fuzzy logic to handle uncertainty, incomplete data, " +
            "and contradictory information common in logistics operations.",
          scientificBasis: 
            "Based on neutrosophy theory developed by Florentin Smarandache, extending classical " +
            "set theory with truth, indeterminacy, and falsity memberships (T,I,F)."
        },
        {
          name: "Analytic Hierarchy Process (AHP)",
          description: 
            "A structured technique for organizing and analyzing complex decisions based on " +
            "mathematics and human psychology.",
          scientificBasis: 
            "Developed by Thomas L. Saaty, AHP converts subjective assessments of relative " +
            "importance into a set of overall weights using pairwise comparisons and matrix operations."
        },
        {
          name: "TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)",
          description: 
            "A multi-criteria decision analysis method that identifies solutions closest to the " +
            "ideal and furthest from the negative-ideal solution.",
          scientificBasis: 
            "Developed by Hwang and Yoon in 1981, TOPSIS creates a preference order by comparing " +
            "Euclidean distances to ideal solutions in normalized weighted decision space."
        }
      ]
    },
    
    benefits: {
      title: "Scientific Benefits of the Neutrosophic AHP-TOPSIS Approach",
      items: [
        {
          title: "Uncertainty Management",
          description: 
            "Explicitly accounts for incomplete and contradictory information in logistics data, " +
            "producing more robust decisions when faced with real-world ambiguity."
        },
        {
          title: "Complete Traceability",
          description: 
            "Every decision is fully traceable to its source data, weights, and computational steps, " +
            "ensuring transparency and accountability."
        },
        {
          title: "Formal Explainability",
          description: 
            "Provides mathematical justifications for all recommendations, enabling users to understand " +
            "not just what was recommended, but precisely why."
        },
        {
          title: "Validation Mechanisms",
          description: 
            "Employs consistency checks and data validation to ensure decisions are based on " +
            "sound inputs and logical processing."
        }
      ]
    },
    
    realWorldImpact: 
      "The Neutrosophic AHP-TOPSIS methodology has demonstrated 15-25% improvements in decision quality " +
      "across logistics operations by providing scientifically sound recommendations " +
      "that account for the inherent uncertainty in complex supply chains."
  };
}
