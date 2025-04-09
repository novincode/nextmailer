import React from "react";
import { Section, Text, Button, Link, Img } from "@react-email/components";
import LayoutTemplate from "./LayoutTemplate";
import { getEmailTheme } from "./colors";

interface LeadMagnetTemplateProps {
  recipientName?: string;
  title: string;
  description?: string;
  downloadUrl: string;
  coverImageUrl?: string;
  buttonText?: string;
  darkMode?: boolean;
}

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === "dark";

const LeadMagnetTemplate: React.FC<LeadMagnetTemplateProps> = ({
  recipientName = "",
  title,
  description = "Here is your free download as promised. Click the button below to access it.",
  downloadUrl,
  coverImageUrl,
  buttonText = "Download Now",
  darkMode,
}) => {
  // If darkMode is not explicitly set, use the default from environment
  const isDarkMode = darkMode ?? defaultIsDarkMode;

  const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,";

  // Get color theme from our centralized system
  const colors = getEmailTheme(isDarkMode);

  return (
    <LayoutTemplate
      previewText={`Your download: ${title}`}
      heading="Your Download Is Ready!"
      darkMode={isDarkMode}
    >
      <Text className={colors.text.secondary}>{greeting}</Text>

      <Text className={colors.text.secondary}>
        Thank you for subscribing! As promised, here is your download:
      </Text>

      {coverImageUrl && (
        <Section className="text-center my-6">
          <Img
            src={coverImageUrl}
            width="200"
            alt={title}
            className={`mx-auto rounded-md ${colors.shadow} h-auto`}
          />
        </Section>
      )}

      <Section className="text-center my-6">
        <Text className={`text-xl font-bold ${colors.text.heading}`}>
          {title}
        </Text>

        <Text className={`${colors.text.secondary} mb-6`}>{description}</Text>

        <Button
          className={`${colors.button.background} ${colors.button.text} font-bold py-3 px-6 rounded`}
          href={downloadUrl}
        >
          {buttonText}
        </Button>
      </Section>

      <Text className={`${colors.text.secondary} mt-6`}>
        If you have any questions or feedback, feel free to reply to this email.
      </Text>

      <Text className={colors.text.secondary}>Enjoy!</Text>
    </LayoutTemplate>
  );
};

export default LeadMagnetTemplate;
