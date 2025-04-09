import { DefaultForm } from "@/components/forms/DefaultForm";
import { TopNav } from "@/components/layout/TopNav";
import { Mail, Bell, Bookmark, CheckCircle, Sparkles } from "lucide-react";
import { Toaster } from "sonner";
import Link from "next/link";

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Stay Connected with {appName}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join our community of forward-thinkers and stay updated with
                    the latest insights, trends, and exclusive content delivered
                    right to your inbox.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#subscribe"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Subscribe Now
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-full max-h-[450px] flex items-center justify-center rounded-lg bg-muted/50 p-6">
                  <Mail className="h-20 w-20 text-muted-foreground/50" />
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow">
                    <Sparkles className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Subscribe to Our Newsletter
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the benefits of joining our growing community
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Timely Updates</h3>
                <p className="text-center text-muted-foreground">
                  Be the first to receive our latest content and important
                  announcements.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bookmark className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Exclusive Content</h3>
                <p className="text-center text-muted-foreground">
                  Gain access to resources and insights not available elsewhere.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Community Connection</h3>
                <p className="text-center text-muted-foreground">
                  Join a community of like-minded individuals with similar
                  interests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section id="subscribe" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Subscribe to Our Newsletter
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of readers who get our weekly newsletter with
                valuable insights and updates. We respect your privacy and will
                never share your information.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2 lg:max-w-none">
              <DefaultForm
                description="Subscribe to receive our newsletter and stay up to date with the latest content."
                buttonText="Join Newsletter"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions? We've got answers.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  How often will I receive newsletters?
                </h3>
                <p className="text-muted-foreground">
                  We send out newsletters on a weekly basis, ensuring you stay
                  updated without overwhelming your inbox.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Can I unsubscribe at any time?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely. Every email includes an unsubscribe link at the
                  bottom, allowing you to opt-out with a single click.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  What content can I expect?
                </h3>
                <p className="text-muted-foreground">
                  Our newsletters include the latest industry trends, useful
                  tips, exclusive resources, and important announcements.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is my information secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we value your privacy. Your information is stored
                  securely and will never be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
