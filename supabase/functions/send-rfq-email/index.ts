
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

interface EmailRequest {
  recipientEmail: string;
  pdfBase64: string;
  rfqReference: string;
  subject?: string;
  testMode?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, pdfBase64, rfqReference, subject, testMode } = await req.json() as EmailRequest;

    // Log more details for debugging
    console.log(`Email request received for: ${recipientEmail}`);
    console.log(`PDF size: ${pdfBase64.length} characters`);
    console.log(`RFQ Reference: ${rfqReference}`);
    console.log(`Test mode: ${testMode ? 'Yes' : 'No'}`);

    // Create the SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: "your-email@gmail.com", // Replace with your Gmail address
          password: Deno.env.get("GMAIL_APP_PASSWORD") || "", // Use app password from environment variable
        },
      },
    });

    // Create the email content
    const message = {
      from: "DeepCAL Operations <your-email@gmail.com>", // Replace with your Gmail address
      to: recipientEmail,
      subject: subject || `Request for Quotation: ${rfqReference}`,
      html: `
        <html>
          <body>
            <h1>Request for Quotation: ${rfqReference}</h1>
            <p>Please find attached the Request for Quotation document.</p>
            <p>This is an automated message from DeepCAL Operations Center.</p>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `RFQ-${rfqReference}.pdf`,
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    };

    // Skip actual sending in test mode
    if (!testMode) {
      await client.send(message);
      console.log("Email sent successfully to:", recipientEmail);
    } else {
      console.log("Test mode: Email would be sent to:", recipientEmail);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email with RFQ ${rfqReference} ${testMode ? 'would be sent' : 'sent'} to ${recipientEmail}`,
        testMode: testMode || false
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
