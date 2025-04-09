import {
  FileText,
  Newspaper,
  UserCheck,
  Copyright,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";
  const currentYear = new Date().getFullYear();

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>

        <p className="text-muted-foreground">Last updated: {currentYear}</p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-lg">
          Welcome to {appName}! These terms outline what to expect from us, and
          what we expect from you. It's pretty straightforward stuff.
        </p>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              What We Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We provide a newsletter service that delivers useful content to
              your inbox. Our goal is to share valuable information, insights,
              and occasional offers that we think you'll find interesting.
            </p>
            <p className="mt-3">
              While we strive to be consistent, we don't guarantee a specific
              publishing schedule. We publish when we have something worthwhile
              to share.
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Subscriber Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>As a subscriber, we ask that you:</p>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Provide accurate and complete contact information</li>
              <li>Keep your contact information updated</li>
              <li>
                Use the unsubscribe link if you no longer wish to receive our
                content
              </li>
              <li>Don't attempt to abuse, spam, or manipulate our systems</li>
            </ul>
            <p className="mt-3">Pretty reasonable stuff, right?</p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Copyright className="h-5 w-5 text-primary" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The content we create is ours. This includes our newsletter,
              website content, logos, designs, and any downloadable resources we
              provide.
            </p>
            <p className="mt-3">
              You can share our content with friends, colleagues, or on social
              media (we appreciate it!), but please give us credit. Don't
              republish our content as your own or sell it.
            </p>
            <p className="mt-3">
              For personal use, feel free to print, save, or reference our
              content. We want our information to be useful to you!
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We provide content for informational purposes. We're not
              responsible for how you apply this information. Use your best
              judgment when implementing any advice or suggestions.
            </p>
            <p className="mt-3">
              We do our best to provide accurate, useful content, but we're
              human. Occasionally there might be typos, outdated information, or
              opinions you disagree with. That's all part of the conversation!
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-primary" />
              Termination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You can unsubscribe at any time through the link in any of our
              emails or by contacting us directly.
            </p>
            <p className="mt-3">
              We reserve the right to terminate access in rare cases of abuse or
              violations of these terms. But honestly, we'd rather have a
              conversation first!
            </p>
          </CardContent>
        </Card>

        <Card className="my-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Changes to These Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update these terms occasionally. If we make significant
              changes, we'll notify subscribers by email about the updates.
            </p>
            <p className="mt-3">
              Continued subscription after changes indicates your acceptance of
              the updated terms.
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
              Questions about these terms? Need clarification? We're real people
              and we're happy to chat. Reach out to us at{" "}
              <span className="font-medium">
                hello@{appName.toLowerCase()}.com
              </span>
              .
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-sm text-muted-foreground">
          <p>
            By subscribing to our newsletter, you acknowledge that you've read
            and agree to these terms.
          </p>
          <p className="mt-3">
            Thanks for being part of our community. We're glad you're here!
          </p>
        </div>
      </div>
    </div>
  );
}
