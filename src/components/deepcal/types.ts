
export interface QuoteData {
  forwarder: string;
  quote: number;
}

export interface ForwarderScore {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
}

export interface WeightFactors {
  cost: number;
  time: number;
  reliability: number;
}

export interface DeepCALProps {
  voicePersonality?: string;
  voiceEnabled?: boolean;
}
