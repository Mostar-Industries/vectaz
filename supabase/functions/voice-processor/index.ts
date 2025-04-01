
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getDeepTalkResponse } from "../_shared/deepTalkUtils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function processes voice queries by converting audio to text
// and then processing the text through the DeepTalk system
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, text, context } = await req.json();
    let queryText = text;
    
    // If audio is provided but no text, we would process audio to text here
    if (audio && !queryText) {
      console.log("Audio processing would happen here in a full implementation");
      // In a real implementation, this would call a speech-to-text service
      // For now, we'll mock this by returning a placeholder text
      queryText = "What are the trends in our logistics performance?";
    }
    
    if (!queryText) {
      throw new Error("No query text or audio provided");
    }
    
    console.log("Processing voice query:", queryText);
    
    // Use the shared utility to get a response from DeepTalk
    const response = await getDeepTalkResponse(queryText, context);
    
    return new Response(JSON.stringify({ 
      response,
      audioUrl: null // In a real implementation, this would be a URL to the TTS audio
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in voice-processor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
