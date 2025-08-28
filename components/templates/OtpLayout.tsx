import React from "react";
import { Section, Text, Button, Link } from "@react-email/components";
import LayoutTemplate from "./LayoutTemplate";
import { getEmailTheme } from "./colors";

interface OtpLayoutProps {
  otpCode: string;
  title?: string;
  description?: string;
  expiryMinutes?: number;
  darkMode?: boolean;
  language?: 'en' | 'fa';
  showFooter?: boolean;
  showUnsubscribe?: boolean;
  customFooter?: React.ReactNode;
  previewText?: string;
  logoUrl?: string;
  footerText?: string;
  unsubscribeUrl?: string;
}

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === "dark";

const OtpLayout: React.FC<OtpLayoutProps> = ({
  otpCode,
  title,
  description,
  expiryMinutes = 10,
  darkMode,
  language = 'en',
  showFooter = false, // Default to false for headless approach
  showUnsubscribe = false, // Default to false for OTP emails
  customFooter,
  previewText,
  logoUrl,
  footerText,
  unsubscribeUrl,
}) => {
  // If darkMode is not explicitly set, use the default from environment
  const isDarkMode = darkMode ?? defaultIsDarkMode;

  // Determine if RTL layout is needed
  const isRTL = language === 'fa';

  // Set default preview text if not provided
  const defaultPreviewText = previewText || `کد بازیابی رمز عبور`;

  // Get color theme from our centralized system
  const colors = getEmailTheme(isDarkMode);

  return (
    <LayoutTemplate
      previewText={defaultPreviewText}
      heading={title}
      darkMode={isDarkMode}
      language={language}
      showFooter={showFooter}
      showUnsubscribe={showUnsubscribe}
      customFooter={customFooter}
      logoUrl={logoUrl}
      footerText={footerText}
      unsubscribeUrl={unsubscribeUrl}
    >
      {description && (
        <Text className={`${colors.text.secondary} ${isRTL ? 'text-right font-fa' : 'text-left'} mb-6`}>
          {description}
        </Text>
      )}

      <Section className="text-center my-8">
        <div
          className={`inline-block px-8 py-6 rounded-lg ${colors.container} border-2 ${colors.border} font-mono text-3xl font-bold tracking-wider ${colors.text.heading} ${
            isRTL ? 'font-fa' : ''
          }`}
        >
          {otpCode}
        </div>
      </Section>

      {expiryMinutes && (
        <Text className={`${colors.text.secondary} text-center mb-6 ${isRTL ? 'font-fa' : ''}`}>
          {isRTL
            ? `این کد تا ${expiryMinutes} دقیقه دیگر معتبر است.`
            : `This code will expire in ${expiryMinutes} minutes.`
          }
        </Text>
      )}
    </LayoutTemplate>
  );
};

export default OtpLayout;