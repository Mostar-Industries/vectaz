
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rasa API key from environment variables
const rasaApiKey = Deno.env.get('RASA_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy', isAfrican = true } = await req.json();
    
    if (!text) {
      throw new Error('No text provided for speech synthesis');
    }
    
    console.log(`Generating speech for text: "${text.substring(0, 50)}..."${text.length > 50 ? '...' : ''}`);
    
    // Use Rasa Voice API
    const response = await fetch('https://api.rasa.com/v1/synthesize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${rasaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice_id: isAfrican ? 'african_female' : voice, // Use African female voice if specified
        output_format: 'mp3',
      }),
    });
    
    if (!response.ok) {
      // Attempt to parse error message
      let errorMessage = "Error calling Rasa API";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || response.statusText;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText;
      }
      
      console.error('Rasa Voice API error:', errorMessage);
      throw new Error(`Rasa API error: ${errorMessage}`);
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
        format: 'mp3' 
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
