import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { VoicePersonality } from '@/types/voice';

// Voice system removed. Replace with your new implementation.
  private static instance: VoiceService;
  private supabase: any;
  private usingTTS: boolean = false;
  
  private constructor() {
    this.initSupabase();
    this.checkTTSAvailability();
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
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

  private async checkTTSAvailability() {
    this.usingTTS = !!this.supabase && 
      typeof window !== 'undefined' && 
      'speechSynthesis' in window;
  }

  public async speak(
    text: string, 
    personality: VoicePersonality = 'calm',
    forceLocal: boolean = false
  ): Promise<void> {
    try {
      if (!this.usingTTS || forceLocal) {
        return this.localSpeak(text, personality);
      }
      await this.cloudSpeak(text, personality);
    } catch (error) {
      console.error('Voice synthesis failed:', error);
      toast({
        title: 'Voice Error',
        description: 'Failed to generate speech',
        variant: 'destructive',
      });
    }
  }

  private async cloudSpeak(text: string, personality: VoicePersonality) {
    if (!this.supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await this.supabase.functions.invoke('text-to-speech', {
      body: { 
        text: this.applyPersonality(text, personality),
        personality,
        model: 'eleven_multilingual_v2'
      }
    });

    if (error) throw error;
    this.playAudio(data.audio);
  }

  private localSpeak(text: string, personality: VoicePersonality) {
    if (typeof window === 'undefined') return;
    
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(
      this.applyPersonality(text, personality)
    );
    
    // Configure voice based on personality
    const voices = synth.getVoices();
    utterance.voice = voices.find(v => 
      personality === 'nigerian' 
        ? v.lang === 'en-NG' || v.name.includes('Africa')
        : v.lang === 'en-US'
    ) || voices[0];

    utterance.rate = personality === 'excited' ? 1.3 : 1.0;
    utterance.pitch = personality === 'sassy' ? 1.2 : 1.0;
    
    synth.speak(utterance);
  }

  private applyPersonality(text: string, personality: VoicePersonality): string {
    // Personality-specific transformations
    switch (personality) {
      case 'nigerian':
        return this.applyNigerianFlavor(text);
      case 'excited':
        return `Hey! ${text}`;
      case 'sassy':
        return `${text}. Obviously.`;
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

  private playAudio(base64: string) {
    const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
    audio.play().catch(e => console.error('Audio playback failed:', e));
  }
}

export const voiceService = VoiceService.getInstance();

export const speakText = (text: string, personality: VoicePersonality = 'calm') => {
  return voiceService.speak(text, personality);
};
