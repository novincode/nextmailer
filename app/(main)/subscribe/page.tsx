import { DefaultForm } from "@/components/forms/DefaultForm";
import { MailCheck, UserPlus, BookOpen, Gift, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SubscribePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";

  return (
    <div className="container max-w-6xl py-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Join Our Newsletter
        </h1>

        <p className="max-w-[700px] text-muted-foreground">
          Stay in the loop with the latest updates, exclusive content, and
          special offers delivered directly to your inbox.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <DefaultForm
              description="Join our growing community of subscribers and never miss an update."
              buttonText="Subscribe Now"
            />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Join a thriving community
            </h2>
            <p className="text-muted-foreground">
              Connect with thousands of like-minded individuals who share your
              passion and interests. Our newsletter is more than just
              emails—it's a community.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Premium content delivered to you
            </h2>
            <p className="text-muted-foreground">
              Receive carefully curated content that's valuable, actionable, and
              exclusive to our subscribers. We focus on quality over quantity.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Exclusive offers and opportunities
            </h2>
            <p className="text-muted-foreground">
              Subscribers get first access to special offers, events, and
              resources that aren't available to the general public.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Stay ahead of the curve
            </h2>
            <p className="text-muted-foreground">
              Be the first to know about trends, insights, and innovations in
              your field. Knowledge is power, and we deliver it straight to your
              inbox.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Already subscribed but want to unsubscribe?{" "}
          <Link href="/unsubscribe" className="text-primary hover:underline">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
}
