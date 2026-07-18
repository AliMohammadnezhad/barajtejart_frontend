import { FaListUl } from "react-icons/fa";

/** فهرست مطالب — از تیترهای h2/h3 مقاله ساخته می‌شود */
export default function TableOfContents({ toc }) {
  if (!toc?.length) return null;

  return (
    <nav
      aria-label="فهرست مطالب"
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-black text-primary-900">
        <FaListUl className="text-accent-500" />
        فهرست مطالب
      </h2>
      <ul className="space-y-2.5 text-sm">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pr-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-slate-500 transition hover:text-accent-600"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
