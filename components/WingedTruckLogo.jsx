// لوگوی کامیون بال‌دار باراج تجارت — نسخهٔ طلایی فلزی برای کارت ویزیت دیجیتال
// کامیون از همان مسیر آیکون اصلی سایت (app/icon.svg) گرفته شده است.
export default function WingedTruckLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label="لوگوی باراج تجارت"
    >
      <defs>
        <linearGradient
          id="btl-gold"
          x1="18"
          y1="14"
          x2="102"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.45" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient
          id="btl-gold-soft"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* قاب دایره‌ای فلزی */}
      <circle
        cx="60"
        cy="60"
        r="57"
        stroke="url(#btl-gold)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="#0f172a"
        fillOpacity="0.5"
        stroke="url(#btl-gold)"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* بال‌های سرعت */}
      <g
        stroke="url(#btl-gold-soft)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeOpacity="0.95"
      >
        <path d="M20 41 C 33 32, 46 28, 60 29" />
        <path d="M25 50 C 36 43, 47 40, 58 41" />
        <path d="M31 58 C 40 53, 49 51, 57 52" />
      </g>

      {/* کامیون باری */}
      <path
        transform="translate(31 52) scale(0.098)"
        fill="url(#btl-gold)"
        d="M621.3 237.3l-58.5-58.5c-12-12-28.3-18.7-45.3-18.7H480V64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64v336c0 44.2 35.8 80 80 80 26.3 0 49.4-12.9 64-32.4 14.6 19.6 37.7 32.4 64 32.4 44.2 0 80-35.8 80-80 0-5.5-.6-10.8-1.6-16h163.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H624c8.8 0 16-7.2 16-16v-85.5c0-17-6.7-33.2-18.7-45.2zM80 432c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm128 0c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm272-224h37.5c4.3 0 8.3 1.7 11.3 4.7l43.3 43.3H480v-48zm48 224c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z"
      />
    </svg>
  );
}
