export interface VoiceConfig {
  defaultPersonality: 'nigerian' | 'sassy' | 'calm' | 'excited';
  fallbackToLocal: boolean;
  volume: number;
  rate: number;
}

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  defaultPersonality: 'calm',
  fallbackToLocal: true,
  volume: 0.8,
  rate: 1.0
};
