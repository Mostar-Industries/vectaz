
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ElevenLabs API key from environment variables
const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY');

// Voice IDs for ElevenLabs
const VOICE_IDS = {
  AFRICAN_MALE: "pNInz6obpgDQGcFmaJgB", // Example African male voice ID
  GEORGE: "JBFqnCBsd6RMkjVDRZzb"        // George voice ID from the documentation
};

// Custom voice modifiers for DeepCAL's personality
const personalityModifiers = {
  formal: { stability: 0.75, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
  casual: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
  excited: { stability: 0.3, similarity_boost: 0.5, style: 0.6, use_speaker_boost: true },
  sassy: { stability: 0.4, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
  technical: { stability: 0.8, similarity_boost: 0.6, style: 0.0, use_speaker_boost: true }
};

// Map predefined message keys to voice clips
const voiceClipMapping: Record<string, string> = {
  "greet": "greet",
  "ranking": "ranking",
  "encourage": "encourage",
  "explain": "explain",
  "joke": "joke",
  "cheer_up": "cheer_up",
  "disruption_clear": "disruption_clear"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, personality = 'sassy', messageKey } = await req.json();
    
    if (!text && !messageKey) {
      throw new Error('No text or message key provided for speech synthesis');
    }
    
    // Check if we have a predefined clip for this message
    let textToSpeak = text;
    if (messageKey && voiceClipMapping[messageKey]) {
      try {
        // Try to load the predefined voice clip based on the mapping
        const clipName = voiceClipMapping[messageKey];
        const filePath = `./voice_clips/${clipName}.txt`;
        
        console.log(`Attempting to use predefined voice clip: ${clipName}`);
        
        // Read the text content from the file
        const voiceClipText = await Deno.readTextFile(filePath);
        
        if (voiceClipText) {
          console.log(`Using predefined voice clip content: "${voiceClipText.substring(0, 50)}..."`);
          textToSpeak = voiceClipText;
        }
      } catch (err) {
        console.warn(`Could not load predefined voice clip: ${err.message}. Falling back to provided text.`);
      }
    }
    
    console.log(`Generating speech for text: "${textToSpeak.substring(0, 50)}..."${textToSpeak.length > 50 ? '...' : ''}`);
    console.log(`Using personality: ${personality}`);
    
    if (!elevenLabsApiKey) {
      throw new Error('ELEVEN_LABS_API_KEY environment variable is not set');
    }

    // Apply personality modifiers
    const voiceSettings = personalityModifiers[personality] || personalityModifiers.sassy;
    
    // Use ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS.GEORGE}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: 'eleven_turbo_v2', // Using the faster model for real-time responses
        voice_settings: voiceSettings
      }),
    });
    
    if (!response.ok) {
      // Attempt to parse error message
      let errorMessage = "Error calling ElevenLabs API";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || response.statusText;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText;
      }
      
      console.error('ElevenLabs API error:', errorMessage);
      throw new Error(`ElevenLabs API error: ${errorMessage}`);
    }
    
    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    
    console.log('Speech generated successfully, returning audio content');
    
    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        format: 'mp3',
        personality: personality 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during speech synthesis' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
