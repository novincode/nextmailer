"use server";

import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { loadEmailTemplate } from "@/lib/email/template-loader";

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === "dark";

// Common email parameters shared across all email types
export interface BaseEmailParams {
  to: string;
  subscriberId?: string;
  campaignId?: string;
  darkMode?: boolean;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

// Template-specific parameters
export interface SendStandardEmailParams extends BaseEmailParams {
  subject: string;
  content: string; // Serializable content
  previewText?: string;
  heading?: string;
  footerText?: string;
  logoUrl?: string;
}

export interface SendLeadMagnetEmailParams extends BaseEmailParams {
  recipientName?: string;
  title: string;
  description?: string;
  downloadUrl: string;
  coverImageUrl?: string;
  buttonText?: string;
}

// OTP email parameters
export interface SendOtpEmailParams {
  to: string;
  otpCode: string;
  recipientName?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  subscriberId?: string;
  campaignId?: string;
  darkMode?: boolean;
  language?: 'en' | 'fa';
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  expiryMinutes?: number;
  showFooter?: boolean;
  showUnsubscribe?: boolean;
  customFooter?: string;
  previewText?: string;
  logoUrl?: string;
  footerText?: string;
  unsubscribeUrl?: string;
}

// Core email sending function that prepares HTML and sends via API
async function sendMail({
  to,
  subject,
  templateName,
  templateProps,
  from,
  cc,
  bcc,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  templateName: string;
  templateProps: Record<string, any>;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}) {
  try {
    // First, render the HTML template
    const html = await loadEmailTemplate(templateName, templateProps);
    
    // Ensure we have a valid API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/send`;
    if (!apiUrl) {
      console.error("Missing API URL configuration");
      return { success: false, error: "API configuration error" };
    }

    // Prepare the request to our API endpoint with rendered HTML
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.RESEND_API_KEY || "",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        from,
        cc,
        bcc,
        replyTo,
      }),
    });

    // Handle response
    if (!response.ok) {
      console.error("API returned error status:", response.status);
      const errorData = await response.json().catch(() => ({})) as any;
      return {
        success: false,
        error: errorData.error || `API error: ${response.status}`,
      };
    }

    // Parse the response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in sendMail:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

// Find or get subscriberId by email
async function getSubscriberIdByEmail(
  email: string,
): Promise<string | undefined> {
  try {
    const subscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);
    return subscriber[0]?.id;
  } catch (error) {
    console.error("Error finding subscriber:", error);
    return undefined;
  }
}

// Standard email with layout template
export async function sendStandardEmail({
  to,
  subject,
  content,
  previewText,
  heading,
  footerText,
  logoUrl,
  darkMode,
  subscriberId,
  campaignId,
  from,
  cc,
  bcc,
  replyTo,
}: SendStandardEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;

    // If subscriberId is not provided, try to find by email
    let subscriberIdToUse = subscriberId;
    if (!subscriberIdToUse) {
      subscriberIdToUse = await getSubscriberIdByEmail(to);
    }

    // Send the email with rendered template
    return await sendMail({
      to,
      subject,
      templateName: "LayoutTemplate", // Direct template name, no conversion needed
      templateProps: {
        content,
        previewText,
        heading,
        footerText,
        logoUrl,
        darkMode: isDarkMode,
        children: content, // Required for LayoutTemplate
      },
      from,
      cc,
      bcc,
      replyTo,
    });
  } catch (error) {
    console.error("Error in sendStandardEmail:", error);
    return { success: false, error: String(error) };
  }
}

// Lead magnet email
export async function sendLeadMagnetEmail({
  to,
  recipientName,
  title,
  description,
  downloadUrl,
  coverImageUrl,
  buttonText = "Download Now",
  subscriberId,
  campaignId,
  darkMode,
  from,
  cc,
  bcc,
  replyTo,
}: SendLeadMagnetEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;

    // If subscriberId is not provided, try to find by email
    let subscriberIdToUse = subscriberId;
    if (!subscriberIdToUse) {
      subscriberIdToUse = await getSubscriberIdByEmail(to);
    }

    // Send the email with rendered template
    return await sendMail({
      to, 
      subject: `Your download: ${title}`,
      templateName: "LeadMagnetTemplate", // Direct template name, no conversion needed
      templateProps: {
        recipientName,
        title,
        description,
        downloadUrl,
        coverImageUrl,
        buttonText,
        darkMode: isDarkMode,
      },
      from,
      cc,
      bcc,
      replyTo,
    });
  } catch (error) {
    console.error("Error in sendLeadMagnetEmail:", error);
    return { success: false, error: String(error) };
  }
}

// OTP email
export async function sendOtpEmail({
  to,
  otpCode,
  recipientName,
  title,
  description,
  buttonText,
  subscriberId,
  campaignId,
  darkMode,
  language = 'en',
  from,
  cc,
  bcc,
  replyTo,
  expiryMinutes,
  showFooter = false,
  showUnsubscribe = false,
  customFooter,
  previewText,
  logoUrl,
  footerText,
  unsubscribeUrl,
}: SendOtpEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;

    // If subscriberId is not provided, try to find by email
    let subscriberIdToUse = subscriberId;
    if (!subscriberIdToUse) {
      subscriberIdToUse = await getSubscriberIdByEmail(to);
    }

    // Send the email with rendered template
    return await sendMail({
      to,
      subject: title || `کد بازیابی رمز عبور`,
      templateName: "OtpLayout",
      templateProps: {
        otpCode,
        title,
        description,
        buttonText,
        darkMode: isDarkMode,
        language,
        expiryMinutes,
        showFooter,
        showUnsubscribe,
        customFooter,
        previewText,
        logoUrl,
        footerText,
        unsubscribeUrl,
      },
      from,
      cc,
      bcc,
      replyTo,
    });
  } catch (error) {
    console.error("Error in sendOtpEmail:", error);
    return { success: false, error: String(error) };
  }
}

// Generic email parameters
export interface SendGenericEmailParams {
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

// Generic email using LayoutTemplate
export async function sendGenericEmail({
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
}: SendGenericEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;

    // If subscriberId is not provided and 'to' is a single email, try to find by email
    let subscriberIdToUse = subscriberId;
    if (!subscriberIdToUse && typeof to === 'string') {
      subscriberIdToUse = await getSubscriberIdByEmail(to);
    }

    // Send the email with rendered template
    return await sendMail({
      to,
      subject,
      templateName: "LayoutTemplate",
      templateProps: {
        content,
        previewText,
        heading,
        footerText,
        logoUrl,
        darkMode: isDarkMode,
        language,
        children: content, // Required for LayoutTemplate
      },
      from,
      cc,
      bcc,
      replyTo,
    });
  } catch (error) {
    console.error("Error in sendGenericEmail:", error);
    return { success: false, error: String(error) };
  }
}
