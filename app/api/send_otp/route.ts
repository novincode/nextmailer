import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/actions/sendEmail";
import { withApiGuard } from "@/lib/utils/api-guard";
import type { SendOtpEmailParams } from "@/lib/actions/sendEmail";

export const runtime = "edge";

// Use the consolidated interface from sendEmail.ts
type SendOtpRequest = SendOtpEmailParams;

// Define the response type
interface OtpResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Protected handler function
async function sendOtpHandler(request: NextRequest): Promise<NextResponse<OtpResponse>> {
  try {
    // Parse the request body
    const requestData: SendOtpRequest = await request.json();

    const {
      to,
      otpCode,
      recipientName,
      title,
      description,
      buttonText,
      subscriberId,
      campaignId,
      darkMode,
      from,
      cc,
      bcc,
      replyTo,
      expiryMinutes,
      language,
      showFooter,
      showUnsubscribe,
      customFooter,
      previewText,
      logoUrl,
      footerText,
      unsubscribeUrl,
    } = requestData;

    // Check for required fields
    if (!to || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: 'to' and 'otpCode' are required" },
        { status: 400 },
      );
    }

    // Send the OTP email using the existing function
    const result = await sendOtpEmail({
      to,
      otpCode,
      recipientName,
      title,
      description,
      buttonText,
      subscriberId,
      campaignId,
      darkMode,
      from,
      cc,
      bcc,
      replyTo,
      expiryMinutes,
      language,
      showFooter,
      showUnsubscribe,
      customFooter,
      previewText,
      logoUrl,
      footerText,
      unsubscribeUrl,
    }) as { success: boolean; data?: any; error?: string };

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "OTP email sent successfully",
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error in OTP API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Export the protected handler
export const POST = withApiGuard(sendOtpHandler);
