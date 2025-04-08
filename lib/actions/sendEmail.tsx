'use server';

import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
import LeadMagnetTemplate from '@/components/templates/LeadMagnetTemplate';
import LayoutTemplate from '@/components/templates/LayoutTemplate';
import { db } from '@/lib/db';
import { emailLogs, EmailStatus, subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === 'dark';

// Basic email sending parameters
interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: any[];
  subscriberId?: string;
  campaignId?: string;
}

// Template-specific parameters
interface SendStandardEmailParams {
  to: string;
  subject: string;
  content: React.ReactNode;
  previewText?: string;
  heading?: string;
  footerText?: string;
  logoUrl?: string;
  darkMode?: boolean;
  subscriberId?: string;
  campaignId?: string;
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
}

// Core email sending function
async function sendMail({
  to,
  subject,
  html,
  from,
  cc,
  bcc,
  replyTo,
  attachments,
  subscriberId,
  campaignId
}: EmailParams) {
  try {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'NextMailer';
    const domain = process.env.RESEND_DOMAIN;
    
    // Use provided from or construct default
    const fromEmail = from || `${appName} <no-reply@${domain}>`;

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      cc,
      bcc,
      replyTo, // Fixed: was "reply_to" before which is incorrect
      attachments
    });

    // Log email status
    if (error) {
      await logEmail(EmailStatus.FAILED, subscriberId, campaignId, undefined, error);
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    await logEmail(EmailStatus.SENT, subscriberId, campaignId, data?.id);
    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    await logEmail(EmailStatus.FAILED, subscriberId, campaignId, undefined, error);
    console.error('Error in sendMail:', error);
    return { success: false, error };
  }
}

// Log the email to the database
async function logEmail(
  status: EmailStatus,
  subscriberId?: string,
  campaignId?: string,
  messageId?: string,
  error?: any
) {
  try {
    await db.insert(emailLogs).values({
      // Drizzle will handle the UUID automatically with defaultRandom()
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
    console.error('Error logging email:', error);
    return false;
  }
}

// Find or get subscriberId by email
async function getSubscriberIdByEmail(email: string): Promise<string | undefined> {
  try {
    const subscriber = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    return subscriber[0]?.id;
  } catch (error) {
    console.error('Error finding subscriber:', error);
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
  campaignId
}: SendStandardEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;
    
    // If subscriberId is not provided, try to find by email
    if (!subscriberId) {
      subscriberId = await getSubscriberIdByEmail(to);
    }

    // Fixed: Use JSX syntax to properly provide children
    const emailHtml = await render(
      <LayoutTemplate
        previewText={previewText}
        heading={heading}
        footerText={footerText}
        logoUrl={logoUrl}
        darkMode={isDarkMode}
      >
        {content}
      </LayoutTemplate>
    );

    // Use the core sendMail function
    return await sendMail({
      to,
      subject,
      html: emailHtml,
      subscriberId,
      campaignId
    });
  } catch (error) {
    console.error('Error in sendStandardEmail:', error);
    return { success: false, error };
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
}: SendLeadMagnetEmailParams) {
  try {
    // If darkMode is not explicitly set, use the default from environment
    const isDarkMode = darkMode ?? defaultIsDarkMode;
    
    // If subscriberId is not provided, try to find by email
    if (!subscriberId) {
      subscriberId = await getSubscriberIdByEmail(to);
    }

    // Use JSX directly for better type checking
    const emailHtml = await render(
      <LeadMagnetTemplate
        recipientName={recipientName}
        title={title}
        description={description}
        downloadUrl={downloadUrl}
        coverImageUrl={coverImageUrl}
        buttonText={buttonText}
        darkMode={isDarkMode}
      />
    );

    // Use the core sendMail function
    return await sendMail({
      to,
      subject: `Your download: ${title}`,
      html: emailHtml,
      subscriberId,
      campaignId
    });
  } catch (error) {
    console.error('Error in sendLeadMagnetEmail:', error);
    return { success: false, error };
  }
}
