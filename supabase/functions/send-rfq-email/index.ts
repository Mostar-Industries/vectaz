
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

interface EmailRequest {
  recipientEmail: string;
  pdfBase64: string;
  rfqReference: string;
  subject?: string;
  testMode?: boolean;
  emailService?: string; // Optional parameter to specify which email service to use
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, pdfBase64, rfqReference, subject, testMode, emailService = 'gmail' } = await req.json() as EmailRequest;

    // Log more details for debugging
    console.log(`Email request received for: ${recipientEmail}`);
    console.log(`PDF size: ${pdfBase64.length} characters`);
    console.log(`RFQ Reference: ${rfqReference}`);
    console.log(`Test mode: ${testMode ? 'Yes' : 'No'}`);
    console.log(`Email service: ${emailService}`);

    // Configure email service based on the requested service
    let client;
    let fromEmail;
    let fromName;
    
    switch (emailService) {
      case 'who':
        // World Health Organization SMTP configuration (example)
        client = new SMTPClient({
          connection: {
            hostname: Deno.env.get("WHO_SMTP_HOST") || "",
            port: Number(Deno.env.get("WHO_SMTP_PORT")) || 465,
            tls: true,
            auth: {
              username: Deno.env.get("WHO_EMAIL") || "",
              password: Deno.env.get("WHO_EMAIL_PASSWORD") || "",
            },
          },
        });
        fromEmail = Deno.env.get("WHO_EMAIL") || "";
        fromName = "WHO Operations";
        break;
      
      case 'gmail':
      default:
        // Default to Gmail configuration
        client = new SMTPClient({
          connection: {
            hostname: "smtp.gmail.com",
            port: 465,
            tls: true,
            auth: {
              username: Deno.env.get("GMAIL_EMAIL") || "",
              password: Deno.env.get("GMAIL_APP_PASSWORD") || "",
            },
          },
        });
        fromEmail = Deno.env.get("GMAIL_EMAIL") || "";
        fromName = "DeepCAL Operations";
        break;
    }

    // Create the email content
    const message = {
      from: `${fromName} <${fromEmail}>`,
      to: recipientEmail,
      subject: subject || `Request for Quotation: ${rfqReference}`,
      html: `
        <html>
          <body>
            <h1>Request for Quotation: ${rfqReference}</h1>
            <p>Please find attached the Request for Quotation document.</p>
            <p>This is an automated message from ${fromName} Center.</p>
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
        testMode: testMode || false,
        emailService
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
