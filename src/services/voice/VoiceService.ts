import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { VoicePersonality } from '@/types/voice';
import { VoiceConfig } from '@/config/voice';

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  defaultPersonality: 'calm',
  fallbackToLocal: true,
  volume: 0.8,
  rate: 1.0
};

export class VoiceService {
  private static instance: VoiceService;
  private supabase: any;
  private config: VoiceConfig;

  private constructor(config?: VoiceConfig) {
    this.config = config || DEFAULT_VOICE_CONFIG;
    this.initSupabase();
  }

  public static getInstance(config?: VoiceConfig): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService(config);
    }
    return VoiceService.instance;
  }

  public setConfig(config: VoiceConfig) {
    this.config = config;
  }

  private initSupabase() {
    try {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        { auth: { persistSession: false } }
      );
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      this.supabase = null;
    }
  }

  public async synthesize(
    text: string, 
    personality: VoicePersonality = this.config.defaultPersonality
  ): Promise<string> {
    try {
      if (!this.supabase) {
        throw new Error('Supabase not configured');
      }
      
      const transformedText = this.applyPersonality(text, personality);
      
      const { data, error } = await this.supabase.functions.invoke('text-to-speech', {
        body: { 
          text: transformedText,
          personality,
          model: 'eleven_multilingual_v2'
        }
      });

      if (error || !data?.audio) {
        throw error || new Error('No audio content received');
      }
      
      return `data:audio/mpeg;base64,${data.audio}`;
    } catch (error) {
      console.error('VoiceService error:', error);
      toast({
        title: 'Voice Error',
        description: error instanceof Error ? error.message : 'Failed to generate speech',
        variant: 'destructive',
      });
      return '';
    }
  }

  public async speak(text: string, personality?: VoicePersonality) {
    const effectivePersonality = personality || this.config.defaultPersonality;
    const finalText = this.applyPersonality(text, effectivePersonality);
    
    try {
      const response = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: finalText,
          volume: this.config.volume,
          rate: this.config.rate 
        })
      });
      
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.volume = this.config.volume;
      await audio.play();
    } catch (err) {
      if (this.config.fallbackToLocal) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.config.rate;
        utterance.volume = this.config.volume;
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  private applyPersonality(text: string, personality: VoicePersonality): string {
    switch (personality) {
      case 'nigerian':
        return this.applyNigerianFlavor(text);
      case 'excited':
        return `Hey! ${text}`;
      case 'sassy':
        return `${text}. Obviously.`;
      case 'calm':
        return `${text}...`;
      default:
        return text;
    }
  }

  private applyNigerianFlavor(text: string): string {
    const expressions = [
      "Ah ah!", "Oya now!", "No wahala!", "Chai!", 
      "I tell you!", "As I dey talk so!", "Abeg!", 
      "Na wa o!", "Walahi!"
    ];
    
    return Math.random() < 0.3
      ? `${expressions[Math.floor(Math.random() * expressions.length)]} ${text}`
      : text;
  }
}

export const voiceService = VoiceService.getInstance();

export const speakText = (text: string, personality?: VoicePersonality) => {
  return VoiceService.getInstance().speak(text, personality);
};
