import { LeadMagnet } from "@/components/forms/LeadMagnet";

export default function ExampleLeadMagnetPage() {
  return (
    <div className="container py-12">
      <LeadMagnet
        title="Get Your Free JavaScript Guide"
        description="Master modern JavaScript with our comprehensive guide. Perfect for beginners and intermediate developers looking to level up their skills."
        contentTitle="Modern JavaScript: From Zero to Hero"
        buttonText="Get My Free Guide"
        formDescription="Enter your details below to receive your free JavaScript guide instantly."
        downloadUrl="https://example.com/downloads/javascript-guide.pdf"
        type="pdf"
        fileFormat="PDF"
      />
    </div>
  );
}
