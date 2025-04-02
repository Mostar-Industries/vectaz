
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const speakText = async (text: string, voicePersonality: string = 'sassy', voiceEnabled: boolean = true): Promise<void> => {
  if (!voiceEnabled) return;
  
  try {
    // Create Supabase client
    const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co'; 
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE'; 
    
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { auth: { persistSession: false } }
    );
    
    // Add Nigerian expressions if using Nigerian personality
    let finalText = text;
    if (voicePersonality === 'nigerian') {
      const nigerianExpressions = [
        "Ah ah!",
        "Oya now!",
        "No wahala!",
        "Chai!",
        "I tell you!",
        "As I dey talk so!",
        "Abeg!",
        "Na wa o!",
        "Walahi!"
      ];
      
      // 30% chance to add Nigerian expression
      if (Math.random() < 0.3) {
        const expression = nigerianExpressions[Math.floor(Math.random() * nigerianExpressions.length)];
        finalText = `${expression} ${text}`;
      }
    }
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text: finalText, 
        personality: voicePersonality,
        model: 'eleven_multilingual_v2'
      }
    });
    
    if (error) {
      console.error("Error generating speech:", error);
      return;
    }
    
    if (!data?.audioContent) {
      console.error("No audio content returned");
      return;
    }
    
    // Play the audio
    const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    
  } catch (error) {
    console.error("Failed to generate or play speech:", error);
    toast({
      title: "Voice Error",
      description: "Failed to generate speech. Please check your connection.",
      variant: "destructive",
    });
  }
};

// Helper to convert base64 to blob
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};
