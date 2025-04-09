import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Cookie,
  Mail,
  ExternalLink,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";
  const currentYear = new Date().getFullYear();

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="text-muted-foreground">Last updated: {currentYear}</p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-lg">
          Hey there! Welcome to {appName}'s privacy policy. We're all about
          transparency, so here's the rundown on how we handle your information.
          No legalese, just plain talk.
        </p>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>When you subscribe to our newsletter, we collect:</p>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Your email address (needed to send you the newsletter)</li>
              <li>Your name (so we can personalize our communications)</li>
              <li>
                Basic analytics like opens and clicks (helps us make better
                content for you)
              </li>
            </ul>
            <p className="mt-3">That's it! We keep it minimal.</p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>We use your information to:</p>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Send you our newsletter (that's why you signed up!)</li>
              <li>Improve our content based on what our readers engage with</li>
              <li>
                Occasionally send you special updates or offers we think you'll
                like
              </li>
            </ul>
            <p className="mt-3">
              We don't sell your data. Ever. That's just not our style.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              How We Keep Your Information Safe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We take reasonable measures to protect your information. We use
              secure, industry-standard practices for storing and processing
              data.
            </p>
            <p className="mt-3">
              While we do our best, no method of transmission over the internet
              is 100% secure. We can't guarantee absolute security, but we're
              committed to protecting your data.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have the right to:</p>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Unsubscribe at any time (there's a link in every email)</li>
              <li>Request to see what information we have about you</li>
              <li>Ask us to update or delete your information</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, just reply to one of our
              newsletters or email us directly.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Cookies & Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our website uses cookies to improve your experience and analyze
              traffic. Email tracking helps us understand if our content is
              actually useful.
            </p>
            <p className="mt-3">
              We use a tiny tracking pixel in emails to know if they were
              opened, and we track link clicks. This helps us create better
              content for you, but if this makes you uncomfortable, you can
              disable images in your email client to prevent open tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We use trusted third-party services to help us run our newsletter,
              including:
            </p>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Email service providers to send and manage emails</li>
              <li>Analytics tools to understand our audience better</li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies, and they all
              comply with applicable privacy regulations.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Have questions about this policy? Need to update your information?
              Just reply to any of our newsletters or contact us directly at{" "}
              <span className="font-medium">
                hello@{appName.toLowerCase()}.com
              </span>
              .
            </p>
            <p className="mt-3">We're real humans and we're happy to help!</p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-sm text-muted-foreground">
          <p>
            By using our website and subscribing to our newsletter, you agree to
            this privacy policy. We may update this policy occasionally, and
            we'll notify you of significant changes by email.
          </p>
        </div>
      </div>
    </div>
  );
}
