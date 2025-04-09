"use server";

import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { loadEmailTemplate } from "@/lib/email/template-loader";

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === "dark";

// Template-specific parameters
interface SendStandardEmailParams {
  to: string;
  subject: string;
  content: string; // Serializable content
  previewText?: string;
  heading?: string;
  footerText?: string;
  logoUrl?: string;
  darkMode?: boolean;
  subscriberId?: string;
  campaignId?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

interface SendLeadMagnetEmailParams {
  to: string;
  recipientName?: string;
  title: string;
  description?: string;
  downloadUrl: string;
  coverImageUrl?: string;
  buttonText?: string;
  subscriberId?: string;
  campaignId?: string;
  darkMode?: boolean;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
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
