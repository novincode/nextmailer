"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { subscribers } from "@/lib/db/schema";
import { subscribeFormSchema } from "@/lib/formSchema";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Parse form data with zod schema
    const parsed = subscribeFormSchema.parse({
      email: formData.get("email"),
      firstName: formData.get("firstName") || undefined,
      lastName: formData.get("lastName") || undefined,
    });

    // Check if subscriber already exists
    const existingSubscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, parsed.email),
    });

    if (existingSubscriber) {
      // Email already exists, return success but indicate it's an existing subscriber
      return {
        success: true,
        message: "Welcome back! You are already subscribed.",
        data: existingSubscriber,
        isExistingSubscriber: true,
      };
    }

    // Insert new subscriber into database
    const result = await db
      .insert(subscribers)
      .values({
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        source: "website",
      })
      .returning({ id: subscribers.id });

    revalidatePath("/");

    return {
      success: true,
      message: "Successfully subscribed! Your eBook is on the way!",
      data: result[0],
      isExistingSubscriber: false,
    };
  } catch (error) {
    console.error("Subscription error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Failed to subscribe. Please try again.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
