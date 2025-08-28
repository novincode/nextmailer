import React from "react";
import { Section, Text, Button, Link } from "@react-email/components";
import LayoutTemplate from "./LayoutTemplate";
import { getEmailTheme } from "./colors";

interface OtpLayoutProps {
  recipientName?: string;
  otpCode: string;
  title?: string;
  description?: string;
  buttonText?: string;
  darkMode?: boolean;
  expiryMinutes?: number;
  language?: 'en' | 'fa'; // Add language support
}

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === "dark";

// Persian translations
const persianTexts = {
  greeting: (name?: string) => name ? `سلام ${name}،` : "سلام،",
  defaultTitle: "کد تأیید شما",
  defaultDescription: "لطفاً از کد تأیید زیر برای تکمیل عملیات خود استفاده کنید.",
  codeExpiry: (minutes: number) => `این کد تا ${minutes} دقیقه دیگر معتبر است.`,
  securityNote: "اگر این کد را درخواست نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.",
  previewText: (code: string) => `کد تأیید شما: ${code}`,
};

// English translations
const englishTexts = {
  greeting: (name?: string) => name ? `Hi ${name},` : "Hi there,",
  defaultTitle: "Your Verification Code",
  defaultDescription: "Please use the verification code below to complete your action.",
  codeExpiry: (minutes: number) => `This code will expire in ${minutes} minutes.`,
  securityNote: "If you didn't request this code, please ignore this email.",
  previewText: (code: string) => `Your verification code: ${code}`,
};

const OtpLayout: React.FC<OtpLayoutProps> = ({
  recipientName = "",
  otpCode,
  title,
  description,
  buttonText = "Verify Code",
  darkMode,
  expiryMinutes = 10,
  language = 'en', // Default to English
}) => {
  // If darkMode is not explicitly set, use the default from environment
  const isDarkMode = darkMode ?? defaultIsDarkMode;

  // Get the appropriate text based on language
  const texts = language === 'fa' ? persianTexts : englishTexts;

  const greeting = texts.greeting(recipientName);
  const defaultTitleText = texts.defaultTitle;
  const defaultDescriptionText = texts.defaultDescription;
  const codeExpiryText = texts.codeExpiry(expiryMinutes);
  const securityNoteText = texts.securityNote;
  const previewTextValue = texts.previewText(otpCode);

  // Get color theme from our centralized system
  const colors = getEmailTheme(isDarkMode);

  return (
    <LayoutTemplate
      previewText={previewTextValue}
      heading={title || defaultTitleText}
      darkMode={isDarkMode}
      language={language}
    >
      <Text className={colors.text.secondary}>{greeting}</Text>

      <Text className={colors.text.secondary}>
        {description || defaultDescriptionText}
      </Text>

      <Section className="text-center my-8">
        <div
          className={`inline-block px-6 py-4 rounded-lg ${colors.container} border-2 ${colors.border} font-mono text-2xl font-bold tracking-wider ${colors.text.heading}`}
        >
          {otpCode}
        </div>
      </Section>

      <Text className={`${colors.text.secondary} text-center mb-6`}>
        {codeExpiryText}
      </Text>

      <Text className={`${colors.text.secondary} text-center`}>
        {securityNoteText}
      </Text>
    </LayoutTemplate>
  );
};

export default OtpLayout;