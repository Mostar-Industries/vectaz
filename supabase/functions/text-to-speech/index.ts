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
  formal: { stability: 0.75, similarity_boost: 0.25 },
  casual: { stability: 0.5, similarity_boost: 0.6 },
  excited: { stability: 0.3, similarity_boost: 0.7 },
  sassy: { stability: 0.4, similarity_boost: 0.6 },
  technical: { stability: 0.8, similarity_boost: 0.2 },
  nigerian: { stability: 0.45, similarity_boost: 0.7 } // Added Nigerian personality
};

// Model descriptions for logging and debugging
const modelDescriptions = {
  eleven_multilingual_v2: "High quality, 29 languages",
  eleven_turbo_v2_5: "Fast, 32 languages",
  eleven_turbo_v2: "Fast, English only" 
};

// Nigerian phrases to occasionally add to responses
const nigerianExpressions = [
  "Ah ah!",
  "Oya now!",
  "No wahala!",
  "Chai!",
  "I tell you!",
  "You dey mad?",
  "Wetin dey?",
  "As I dey talk so!",
  "Abeg!",
  "Na wa o!",
  "Walahi!",
  "Make we go!",
  "E go better!"
];

// Function to add Nigerian expressions
const enhanceWithNigerianExpressions = (text: string, personality: string): string => {
  if (personality !== 'nigerian') return text;
  
  // Only add expressions ~20% of the time to keep it natural
  if (Math.random() > 0.2) return text;
  
  const expression = nigerianExpressions[Math.floor(Math.random() * nigerianExpressions.length)];
  
  // Add at beginning, middle, or end
  const position = Math.floor(Math.random() * 3);
  
  if (position === 0) {
    return `${expression} ${text}`;
  } else if (position === 1) {
    const sentences = text.split('.');
    if (sentences.length > 1) {
      const insertPos = Math.floor(sentences.length / 2);
      sentences.splice(insertPos, 0, ` ${expression}`);
      return sentences.join('.');
    }
    return text;
  } else {
    return `${text} ${expression}`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if API key is configured
  if (!elevenLabsApiKey) {
    console.error('ElevenLabs API key not configured');
    return new Response(
      JSON.stringify({ 
        error: 'ElevenLabs API key not configured in environment variables' 
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

  try {
    const { text, personality = 'sassy', model = 'eleven_multilingual_v2' } = await req.json();
    
    if (!text) {
      throw new Error('No text provided for speech synthesis');
    }
    
    console.log(`Generating speech for text: "${text.substring(0, 50)}..."${text.length > 50 ? '...' : ''}`);
    console.log(`Using personality: ${personality}, model: ${model} (${modelDescriptions[model] || 'custom model'})`);
    
    // Apply personality modifiers - use default if not found
    const modifier = personalityModifiers[personality] || personalityModifiers.sassy;
    
    // Enhance text with Nigerian expressions if Nigerian personality
    const enhancedText = enhanceWithNigerianExpressions(text, personality);
    
    // Use ElevenLabs API - set timeout to 20 seconds for longer text
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    try {
      // Using the specified voice ID for all personalities
      const voiceId = 'r9DosIwaFvTjhC7gp1d2'; // As specified by user
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: enhancedText,
          model_id: model,
          voice_settings: {
            stability: modifier.stability,
            similarity_boost: modifier.similarity_boost,
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
          personality: personality,
          model: model
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('Speech generation timed out after 20 seconds');
      }
      throw e;
    }
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
