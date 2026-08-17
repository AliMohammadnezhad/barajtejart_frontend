import Link from "next/link";

// محتوای مشترک صفحهٔ ۴۰۴ — هم در ریشهٔ app (بدون کروم سایت)
// و هم در گروه (site) (به‌همراه نوبار و فوتر) استفاده می‌شود.
export default function NotFoundContent() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-primary-950 px-6 pt-20">
      <div className="text-center">
        <p className="text-7xl font-black text-accent-400">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-black text-white">صفحهٔ موردنظر پیدا نشد</h1>
        <p className="mt-3 text-slate-300">
          ممکن است آدرس تغییر کرده یا صفحه حذف شده باشد.
        </p>
        <Link href="/" className="btn-primary mt-8">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </section>
  );
}
