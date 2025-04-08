import Footer from "@/components/layout/Footer";
import { TopNav } from "@/components/layout/TopNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
