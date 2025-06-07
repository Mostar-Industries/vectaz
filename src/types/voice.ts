export type VoicePersonality = 
  | 'nigerian'
  | 'sassy'
  | 'calm'
  | 'excited';

export interface VoiceSettings {
  voice: string;
  enabled: boolean;
  volume: number;
  rate: number;
  personality: VoicePersonality;
};
