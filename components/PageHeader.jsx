import Link from "next/link";

/** سربرگ صفحات داخلی با مسیر راهنما (Breadcrumb) */
export default function PageHeader({ title, subtitle, crumbs = [] }) {
  return (
    <section className="bg-primary-950 pb-16 pt-36 text-center">
      <div className="container-site">
        <h1 className="text-3xl font-black text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">{subtitle}</p>
        )}
        <nav className="mt-6 flex justify-center gap-2 text-sm text-slate-400" aria-label="مسیر صفحه">
          <Link href="/" className="transition hover:text-accent-400">
            صفحه اصلی
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-2">
              <span>/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-accent-400">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-accent-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
