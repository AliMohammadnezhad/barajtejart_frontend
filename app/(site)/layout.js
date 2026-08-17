import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// چیدمان صفحات اصلی سایت — نوبار و فوتر فقط روی همین گروه اعمال می‌شود؛
// صفحهٔ کارت ویزیت (/card) عمداً بدون این کروم رندر می‌شود.
export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
