"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeFormSchema, SubscribeFormValues } from "@/lib/formSchema";
import { subscribeToNewsletter } from "@/lib/actions/subscribe";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DefaultFormProps {
  onFinish?: (data: any) => void;
  description?: string;
  buttonText?: string;
}

export function DefaultForm({
  onFinish,
  description = "Join our newsletter for the latest updates and news.",
  buttonText = "Subscribe",
}: DefaultFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(data: SubscribeFormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("email", data.email);
    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);

    try {
      const result = await subscribeToNewsletter(formData);

      if (result.success) {
        toast.success(result.message);
        form.reset();

        // Always call onFinish if it exists, regardless of whether this is a new or existing subscriber
        if (onFinish)
          onFinish({
            ...result.data,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
          });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormDescription className="text-center sm:text-left">
          {description}
        </FormDescription>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {buttonText}
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
