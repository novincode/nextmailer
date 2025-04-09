/**
 * Email Template Color System
 *
 * This file provides a consistent color palette for all email templates.
 * Since CSS variables don't work reliably in email clients, we use explicit
 * Tailwind classes organized by theme and purpose.
 */

export interface EmailColorScheme {
  // Backgrounds
  background: string; // Page background
  container: string; // Main email container
  card: string; // Card/section backgrounds

  // Text colors
  text: {
    primary: string; // Main text color
    secondary: string; // Less emphasized text
    muted: string; // De-emphasized text (footer, etc)
    heading: string; // Headings
  };

  // Interactive elements
  button: {
    background: string; // Button background
    text: string; // Button text
    border: string; // Button border
    hover?: string; // Button hover state (if supported)
  };

  // Decorative elements
  border: string; // Border colors
  link: string; // Link color

  // Utility
  shadow: string; // Shadow style
}

// Light theme colors (default)
export const lightColors: EmailColorScheme = {
  background: "bg-gray-50",
  container: "bg-white",
  card: "bg-white",

  text: {
    primary: "text-gray-800",
    secondary: "text-gray-700",
    muted: "text-gray-500",
    heading: "text-gray-900",
  },

  button: {
    background: "bg-indigo-600",
    text: "text-white",
    border: "border-transparent",
    hover: "hover:bg-indigo-700",
  },

  border: "border-gray-200",
  link: "text-indigo-600",
  shadow: "shadow-sm",
};

// Dark theme colors
export const darkColors: EmailColorScheme = {
  background: "bg-gray-900",
  container: "bg-gray-800",
  card: "bg-gray-800",

  text: {
    primary: "text-gray-100",
    secondary: "text-gray-300",
    muted: "text-gray-400",
    heading: "text-white",
  },

  button: {
    background: "bg-indigo-500",
    text: "text-white",
    border: "border-transparent",
    hover: "hover:bg-indigo-400",
  },

  border: "border-gray-700",
  link: "text-indigo-400",
  shadow: "shadow-md",
};

// Function to get appropriate theme colors
export function getEmailTheme(darkMode = false): EmailColorScheme {
  return darkMode ? darkColors : lightColors;
}
