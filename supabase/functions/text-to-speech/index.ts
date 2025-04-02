
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ElevenLabs API key from environment variables
const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY');

// Custom voice modifiers for DeepCAL's personality
const personalityModifiers = {
  formal: { stability: 0.7, similarity_boost: 0.3 },
  casual: { stability: 0.5, similarity_boost: 0.6 },
  excited: { stability: 0.3, similarity_boost: 0.7 },
  sassy: { stability: 0.4, similarity_boost: 0.6 },
  technical: { stability: 0.8, similarity_boost: 0.2 }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, personality = 'sassy', model = 'eleven_multilingual_v2' } = await req.json();
    
    if (!text) {
      throw new Error('No text provided for speech synthesis');
    }
    
    console.log(`Generating speech for text: "${text.substring(0, 50)}..."${text.length > 50 ? '...' : ''}`);
    console.log(`Using personality: ${personality}, model: ${model}`);
    
    // Apply personality modifiers
    const modifier = personalityModifiers[personality] || personalityModifiers.sassy;
    
    // Use ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/r9DosIwaFvTjhC7gp1d2', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: model,
        voice_settings: {
          stability: modifier.stability,
          similarity_boost: modifier.similarity_boost,
        }
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
