import { NextRequest, NextResponse } from "next/server";
import { sendGenericEmail } from "@/lib/actions/sendEmail";
import { withApiGuard } from "@/lib/utils/api-guard";

export const runtime = "edge";

// Define the request body type for generic email
interface SendGenericEmailRequest {
  to: string | string[];
  subject: string;
  content: string;
  previewText?: string;
  heading?: string;
  footerText?: string;
  logoUrl?: string;
  subscriberId?: string;
  campaignId?: string;
  darkMode?: boolean;
  language?: 'en' | 'fa';
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

// Define the response type
interface GenericEmailResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Protected handler function
async function sendGenericEmailHandler(request: NextRequest): Promise<NextResponse<GenericEmailResponse>> {
  try {
    // Parse the request body
    const requestData: SendGenericEmailRequest = await request.json();

    const {
      to,
      subject,
      content,
      previewText,
      heading,
      footerText,
      logoUrl,
      subscriberId,
      campaignId,
      darkMode,
      language = 'en',
      from,
      cc,
      bcc,
      replyTo,
    } = requestData;

    // Check for required fields
    if (!to || !subject || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: 'to', 'subject', and 'content' are required" },
        { status: 400 },
      );
    }

    // Send the generic email using the existing function
    const result = await sendGenericEmail({
      to,
      subject,
      content,
      previewText,
      heading,
      footerText,
      logoUrl,
      subscriberId,
      campaignId,
      darkMode,
      language,
      from,
      cc,
      bcc,
      replyTo,
    }) as { success: boolean; data?: any; error?: string };

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error in generic email API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Export the protected handler
export const POST = withApiGuard(sendGenericEmailHandler);
