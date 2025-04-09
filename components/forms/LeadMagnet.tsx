"use client";

import React from "react";
import {
  Book,
  BookOpen,
  BookText,
  Download,
  ChevronRight,
  FileText,
  Video,
  FileImage,
  File,
} from "lucide-react";
import { DefaultForm } from "@/components/forms/DefaultForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendLeadMagnetEmail } from "@/lib/actions/sendEmail";

type LeadMagnetType =
  | "ebook"
  | "pdf"
  | "video"
  | "image"
  | "audio"
  | "checklist"
  | "template"
  | "other";

interface LeadMagnetProps {
  title: string;
  description: string;
  contentTitle: string;
  buttonText?: string;
  coverImageUrl?: string;
  formDescription?: string;
  downloadUrl: string;
  type?: LeadMagnetType;
  fileFormat?: string;
  onSubscribe?: (data: any) => void;
}

// Helper function to get icons based on lead magnet type
const getIconsForType = (type: LeadMagnetType) => {
  switch (type) {
    case "ebook":
      return [
        {
          icon: BookOpen,
          title: "Easy to Read",
          description: "Formatted for your convenience",
        },
        {
          icon: BookText,
          title: "Practical Advice",
          description: "Actionable strategies included",
        },
        {
          icon: Download,
          title: "Instant Access",
          description: "Delivered straight to your inbox",
        },
        {
          icon: Book,
          title: "Expert Content",
          description: "Written by industry professionals",
        },
      ];
    case "pdf":
      return [
        {
          icon: FileText,
          title: "Detailed Guide",
          description: "Comprehensive information",
        },
        {
          icon: Download,
          title: "Instant Access",
          description: "Delivered straight to your inbox",
        },
        {
          icon: File,
          title: "Printable Format",
          description: "Print for easy reference",
        },
        {
          icon: BookText,
          title: "Expert Content",
          description: "Created by professionals",
        },
      ];
    case "video":
      return [
        {
          icon: Video,
          title: "HD Quality",
          description: "Clear visual instruction",
        },
        {
          icon: Download,
          title: "Instant Access",
          description: "Available immediately",
        },
        {
          icon: BookText,
          title: "Expert Content",
          description: "Professional instruction",
        },
        {
          icon: File,
          title: "Supplemental Materials",
          description: "Additional resources included",
        },
      ];
    default:
      return [
        {
          icon: File,
          title: "Valuable Content",
          description: "High-quality information",
        },
        {
          icon: Download,
          title: "Instant Access",
          description: "Delivered straight to your inbox",
        },
        {
          icon: FileText,
          title: "Practical Resource",
          description: "Ready to use right away",
        },
        {
          icon: BookText,
          title: "Expert Content",
          description: "Created by professionals",
        },
      ];
  }
};

export function LeadMagnet({
  title = "Get Your Free Resource",
  description = "Subscribe to our newsletter and get this valuable resource for free.",
  contentTitle = "Premium Resource",
  buttonText = "Get It Now",
  coverImageUrl,
  formDescription = "Enter your details below to receive your free resource instantly.",
  downloadUrl = "https://example.com/resource.pdf",
  type = "other",
  fileFormat = "PDF",
  onSubscribe,
}: LeadMagnetProps) {
  const handleFormSubmission = async (data: any) => {
    // Always send the email regardless of whether it's a new or existing subscriber
    try {
      await sendLeadMagnetEmail({
        to: data.email,
        recipientName: data.firstName || "",
        title: contentTitle,
        downloadUrl,
        coverImageUrl,
        buttonText: `Download ${type === "ebook" ? "Your eBook" : "Now"}`,
      });

      // If there's a custom onSubscribe handler, call it
      if (onSubscribe) {
        onSubscribe(data);
      }
    } catch (error) {
      console.error("Failed to send lead magnet email:", error);
    }
  };

  const icons = getIconsForType(type);

  return (
    <div className="grid gap-8 md:grid-cols-2 items-center max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>

        <div className="grid grid-cols-2 gap-4">
          {icons.map((item, index) => (
            <Card key={index}>
              <CardHeader className="p-4 pb-2">
                <item.icon className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <CardTitle className="text-sm">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">{fileFormat} format</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-xs">Mobile friendly</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-xs">Instant delivery</span>
        </div>
      </div>

      <div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get "{contentTitle}"</CardTitle>
            <CardDescription>{formDescription}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {coverImageUrl && (
              <div className="mx-auto w-40 aspect-[3/4] bg-secondary rounded-md overflow-hidden mb-4">
                <img
                  src={coverImageUrl}
                  alt={contentTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <DefaultForm
              buttonText={buttonText}
              description=""
              onFinish={handleFormSubmission}
            />
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground text-center">
            <p>
              By subscribing, you agree to our privacy policy and allow us to
              send you emails. You can unsubscribe at any time.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LeadMagnet;
