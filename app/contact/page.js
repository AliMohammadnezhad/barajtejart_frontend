import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "تماس با ما",
  description: `مشاوره رایگان ترخیص کالا و واردات از چین و اروپا — با کارشناسان ${siteConfig.name} تماس بگیرید: ${siteConfig.phone}`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `تماس با ${siteConfig.name}`,
    description: `استعلام قیمت ترخیص کالا و واردات — پاسخگویی ${siteConfig.workingHours}`,
    url: "/contact",
  },
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
