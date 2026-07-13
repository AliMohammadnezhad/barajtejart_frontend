/**
 * رندر سمت سرور دادهٔ ساخت‌یافته (JSON-LD) برای موتورهای جستجو.
 * usage: <JsonLd data={organizationSchema()} />  یا آرایه‌ای از اسکیماها.
 */
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
    />
  ));
}
