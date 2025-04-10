"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { subscribers, SubscriberStatus } from "@/lib/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifyTurnstileToken } from "@/lib/utils/turnstile";

// Simple schema for email validation
const unsubscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export async function unsubscribeFromNewsletter(formData: FormData) {
  try {
    // Get turnstile token
    const turnstileToken = formData.get("turnstileToken") as string;
    
    // Verify Turnstile token
    if (!turnstileToken) {
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }

    const isValid = await verifyTurnstileToken(turnstileToken);
    if (!isValid) {
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }
    
    // Parse the email from form data
    const email = formData.get("email") as string;
    const parsed = unsubscribeSchema.parse({ email });

    // Find the subscriber
    const existingSubscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, parsed.email),
    });

    if (!existingSubscriber) {
      return {
        success: false,
        message: "We couldn't find that email address in our system.",
      };
    }

    // Check if already unsubscribed
    if (existingSubscriber.status === SubscriberStatus.UNSUBSCRIBED) {
      return {
        success: true,
        message: "You've already been unsubscribed from our mailing list.",
        alreadyUnsubscribed: true,
      };
    }

    // Update subscriber status to unsubscribed
    await db
      .update(subscribers)
      .set({
        status: SubscriberStatus.UNSUBSCRIBED,
        updatedAt: new Date(),
      })
      .where(eq(subscribers.id, existingSubscriber.id));

    revalidatePath("/unsubscribe");

    return {
      success: true,
      message: "You've been successfully unsubscribed from our mailing list.",
    };
  } catch (error) {
    console.error("Unsubscribe error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message:
          error.message || "Failed to process your request. Please try again.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
