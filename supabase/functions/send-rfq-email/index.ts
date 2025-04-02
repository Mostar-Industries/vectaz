
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface EmailRequest {
  recipientEmail: string;
  pdfBase64: string;
  rfqReference: string;
  subject?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, pdfBase64, rfqReference, subject } = await req.json() as EmailRequest;

    // In a real implementation, you would use an email service like Resend or SendGrid
    // For this demo, we'll log the request and simulate success
    console.log(`Email request received for: ${recipientEmail}`);
    console.log(`PDF size: ${pdfBase64.length} characters`);
    console.log(`RFQ Reference: ${rfqReference}`);

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email with RFQ ${rfqReference} sent to ${recipientEmail}` 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending RFQ email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
