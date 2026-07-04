import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "تماس با ما",
  description: `برای استعلام قیمت و مشاوره حمل‌ونقل با ${siteConfig.name} در تماس باشید.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="تماس با ما"
        subtitle="برای استعلام قیمت، مشاوره مسیر یا پیگیری محموله، از راه‌های زیر با ما در ارتباط باشید."
        crumbs={[{ label: "تماس با ما" }]}
      />
      <ContactSection heading={false} />
      <FAQSection />
    </>
  );
}
