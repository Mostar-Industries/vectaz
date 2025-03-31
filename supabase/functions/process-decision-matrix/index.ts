
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Perform a simplified version of AHP-TOPSIS calculation
function ahpTopsisCalculation(matrix: number[][]): number[] {
  // This is a simplified stand-in for the Python calculation
  // In a production environment, you would call a dedicated Python service
  
  // Step 1: Calculate row sums (simplified)
  const rowSums = matrix.map(row => 
    row.reduce((sum, val) => sum + val, 0)
  );
  
  // Step 2: Normalize by the sum
  const total = rowSums.reduce((sum, val) => sum + val, 0);
  const normalizedScores = rowSums.map(val => val / total);
  
  return normalizedScores;
}

// Store the result in the database
async function storeResult(result: any): Promise<void> {
  const { error } = await supabase
    .from('calculation_results')
    .insert({
      scores: result.scores,
      method: result.method,
      timestamp: new Date().toISOString()
    });
  
  if (error) {
    console.error('Error storing result:', error);
  }
}

// Call Python API for advanced calculations (if available)
async function callPythonApi(matrix: number[][]): Promise<any> {
  try {
    // This would be your actual Python API endpoint
    // For now, we'll simulate a failure to trigger the TypeScript fallback
    throw new Error("Python API not configured");
    
    /*
    const response = await fetch('https://your-python-api.com/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matrix }),
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error calling Python API:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  
  try {
    // Parse the request body
    const { matrix } = await req.json();
    
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
      throw new Error('Invalid matrix data');
    }
    
    let result;
    
    try {
      // Try to call the Python API first
      result = await callPythonApi(matrix);
      result.method = "python-neutrosophic";
    } catch (error) {
      // Fall back to the TypeScript implementation
      console.log('Falling back to TypeScript implementation');
      const scores = ahpTopsisCalculation(matrix);
      result = {
        scores,
        method: "typescript-fallback",
        timestamp: new Date().toISOString()
      };
    }
    
    // Store the result in the database
    await storeResult(result);
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
