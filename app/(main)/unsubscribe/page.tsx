import { UnsubscribeForm } from "@/components/forms/UnsubscribeForm";
import { 
  HeartCrack, 
  ArrowLeftRight,
  Mail,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function UnsubscribePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";

  return (
    <div className="container max-w-6xl py-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <HeartCrack className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          We're Sorry To See You Go
        </h1>
        
        <p className="max-w-[700px] text-muted-foreground">
          Before you unsubscribe, we'd like you to know that we've valued having you as part of our community.
          If you're sure you want to leave, we understand and respect your decision.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Unsubscribe from {appName}</CardTitle>
            <CardDescription>
              Please enter your email address to unsubscribe from our mailing list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnsubscribeForm description="We'll miss you, but we understand sometimes it's time to part ways. Enter your email below to unsubscribe." />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Change frequency instead?
            </h2>
            <p className="text-muted-foreground">
              If our emails are too frequent, you might prefer to receive them less often 
              rather than unsubscribing completely.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Update your preferences
            </h2>
            <p className="text-muted-foreground">
              You can customize what types of content you receive from us to make 
              sure you only get what's relevant to you.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Your privacy matters
            </h2>
            <p className="text-muted-foreground">
              We respect your decision and your data. Once unsubscribed, your information 
              will no longer be used for our newsletter communications.
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-muted/40 rounded-lg border border-muted">
            <p className="text-sm text-muted-foreground">
              "We've enjoyed having you as part of our community. If you ever want to rejoin, 
              we'll be here with open arms and valuable content ready for you."
            </p>
            <p className="text-sm font-medium mt-2">The {appName} Team</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Changed your mind? <Link href="/subscribe" className="text-primary hover:underline">Subscribe here</Link> instead.
        </p>
      </div>
    </div>
  );
}
