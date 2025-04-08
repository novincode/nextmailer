"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { unsubscribeFromNewsletter } from "@/lib/actions/unsubscribe"
import { toast } from "sonner"
import { Heart, Frown, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const unsubscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

type UnsubscribeFormValues = z.infer<typeof unsubscribeSchema>;

interface UnsubscribeFormProps {
  description?: string;
}

export function UnsubscribeForm({ 
  description = "We're sad to see you go, but we respect your decision."
}: UnsubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)

  const form = useForm<UnsubscribeFormValues>({
    resolver: zodResolver(unsubscribeSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: UnsubscribeFormValues) {
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append("email", data.email)
    
    try {
      const result = await unsubscribeFromNewsletter(formData)
      
      if (result.success) {
        toast.success(result.message);
        setIsUnsubscribed(true);
        form.reset()
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isUnsubscribed) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium">We'll Miss You</h3>
        <p className="text-muted-foreground">
          You've been successfully unsubscribed from our mailing list.
          We wish you all the best on your journey, and our door is always open if you wish to return.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button variant="outline" onClick={() => setIsUnsubscribed(false)} className="mb-2 sm:mb-0">
            Change your mind?
          </Button>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormDescription className="text-center sm:text-left">
          {description}
        </FormDescription>
        
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
              <Frown className="h-4 w-4" />
              Unsubscribe
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
