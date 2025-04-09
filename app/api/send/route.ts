import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailLogs, EmailStatus } from "@/lib/db/schema";

export const runtime = "edge";

// Define a more specific type for the request body
interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html: string; // Now receiving prepared HTML directly
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: any[];
  subscriberId?: string;
  campaignId?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Get auth headers
    const apiKey = request.headers.get("x-api-key");
    const timestamp = request.headers.get("x-internal-timestamp");
    const internalToken = request.headers.get("x-internal-token");
    
    console.log(`[DEBUG] Auth headers - API Key: ${apiKey ? "Present" : "Missing"}`);
    console.log(`[DEBUG] Auth headers - Timestamp: ${timestamp || "Missing"}`);
    console.log(`[DEBUG] Auth headers - Internal token: ${internalToken ? "Present" : "Missing"}`);
    
    // Validate that the request is coming from our own application
    // Try both authentication methods
    const isValidApiKey = apiKey === process.env.RESEND_API_KEY;
    const isValidInternalToken = validateInternalToken(timestamp, internalToken);
    
    if (!isValidApiKey && !isValidInternalToken) {
      console.log(`[DEBUG] Authentication failed - API Key valid: ${isValidApiKey}, Internal token valid: ${isValidInternalToken}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log auth success
    console.log(`[DEBUG] Request authenticated via ${isValidApiKey ? "API Key" : "Internal token"}`);

    // Parse the request body
    const requestData: SendEmailRequest = await request.json();

    const {
      to,
      subject,
      html, // Now receiving HTML directly
      from,
      cc,
      bcc,
      replyTo,
      attachments,
      subscriberId,
      campaignId,
      trackOpens = true,
      trackClicks = true,
    } = requestData;

    // Check for required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Prepare the appName and domain
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "NextMailer";
    const domain = process.env.RESEND_DOMAIN;

    // Construct the from address if not provided
    const fromEmail = from || `${appName} <no-reply@${domain}>`;

    // Prepare the request payload for Resend API
    const resendPayload = {
      from: fromEmail,
      to,
      subject,
      html, // Use the HTML directly
      cc,
      bcc,
      reply_to: replyTo,
      attachments,
      text: `${subject} - View this email in your browser for better formatting.`,
      tags: [
        { name: "source", value: "nextmailer-api" },
        ...(campaignId ? [{ name: "campaign_id", value: campaignId }] : []),
      ],
    };

    // Direct API call to Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(resendPayload),
    });

    // Parse the Resend API response
    const resendResult = (await resendResponse.json()) as any;

    // Handle error response from Resend API
    if (!resendResponse.ok) {
      console.error("Error sending email via Resend API:", resendResult);
      await logEmail(
        EmailStatus.FAILED,
        subscriberId,
        campaignId,
        undefined,
        resendResult,
      );
      return NextResponse.json(
        { success: false, error: resendResult },
        { status: resendResponse.status },
      );
    }

    // Log successful email send
    await logEmail(EmailStatus.SENT, subscriberId, campaignId, resendResult.id);
    console.log("Email sent successfully via Resend API:", resendResult.id);

    return NextResponse.json({
      success: true,
      data: { id: resendResult.id },
    });
  } catch (error) {
    console.error("Unexpected error in email API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Validate the internal token for cross-function authentication
function validateInternalToken(timestamp: string | null, token: string | null): boolean {
  if (!timestamp || !token) return false;
  
  // Ensure the timestamp is recent (within 5 minutes)
  const ts = parseInt(timestamp, 10);
  const now = Date.now();
  if (isNaN(ts) || now - ts > 5 * 60 * 1000) {
    return false; // Token too old or invalid timestamp
  }
  
  // Generate expected token
  const apiKey = process.env.RESEND_API_KEY || "default-key";
  const secretData = `${timestamp}-${apiKey}-internal-auth`;
  
  // Use the same hashing method as in the generateInternalToken function
  let hash = 0;
  for (let i = 0; i < secretData.length; i++) {
    const char = secretData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const expectedToken = Math.abs(hash).toString(16);
  
  return token === expectedToken;
}

// Helper function to log emails to the database
async function logEmail(
  status: EmailStatus,
  subscriberId?: string,
  campaignId?: string,
  messageId?: string,
  error?: any,
) {
  try {
    await db.insert(emailLogs).values({
      // Drizzle will handle the UUID automatically
      subscriberId: subscriberId || null,
      campaignId: campaignId || null,
      status,
      messageId: messageId || null,
      error: error ? JSON.stringify(error) : null,
      metadata: { opens: 0, clicks: 0 },
    });
    console.log(`Email logged with status: ${status}`);
    return true;
  } catch (error) {
    console.error("Error logging email in API route:", error);
    return false;
  }
}
