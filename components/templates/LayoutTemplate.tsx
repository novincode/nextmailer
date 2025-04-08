import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Link,
  Hr,
  Img,
} from '@react-email/components';
import { getEmailTheme } from './colors';

interface LayoutTemplateProps {
  previewText?: string;
  heading?: string;
  children: React.ReactNode;
  footerText?: string;
  unsubscribeUrl?: string;
  logoUrl?: string;
  darkMode?: boolean;
}

// Get default theme from environment
const defaultIsDarkMode = process.env.DEFAULT_MAIL_THEME === 'dark';

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({
  previewText,
  heading,
  children,
  footerText,
  unsubscribeUrl,
  logoUrl,
  darkMode,
}) => {
  // If darkMode is not explicitly set, use the default from environment
  const isDarkMode = darkMode ?? defaultIsDarkMode;
  
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'NextMailer';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextmailer.com';
  
  // Set defaults using environment variables
  previewText = previewText || `Email from ${appName}`;
  heading = heading || appName;
  footerText = footerText || `© ${new Date().getFullYear()} ${appName}. All rights reserved.`;
  unsubscribeUrl = unsubscribeUrl || `${appUrl}/unsubscribe`;
  logoUrl = logoUrl || `${appUrl}/${isDarkMode ? 'logo-light.png' : 'logo-dark.png'}`;

  // Get color theme based on mode
  const colors = getEmailTheme(isDarkMode);
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className={`${colors.background} font-sans`}>
          <Container className={`mx-auto my-8 max-w-[600px] rounded-lg ${colors.container} p-8 ${colors.shadow}`}>
            <Section className="mb-6 text-center">
              {logoUrl && (
                <Img
                  src={logoUrl}
                  alt={`${appName} Logo`}
                  width="120"
                  className="mx-auto mb-4 h-auto"
                />
              )}
              {heading && (
                <Heading className={`text-2xl font-bold ${colors.text.heading} mb-0`}>
                  {heading}
                </Heading>
              )}
            </Section>
            
            <Section className={`mb-6 ${colors.text.primary}`}>
              {children}
            </Section>
            
            <Hr className={`border-t ${colors.border} my-6`} />
            
            <Section className={`text-center ${colors.text.muted} text-xs`}>
              <Text>{footerText}</Text>
              <Text>
                <Link href={unsubscribeUrl} className={`${colors.link} underline`}>
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LayoutTemplate;
