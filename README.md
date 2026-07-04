# باراج تجارت — وب‌سایت حمل‌ونقل بین‌المللی

بازسازی مدرن و فارسی (RTL) دموی `a.meharat.com/transportation-ml` با **Next.js (App Router)**، **Tailwind CSS** و **Framer Motion**.

## راه‌اندازی

```bash
npm install
npm run dev
```

سپس آدرس <http://localhost:3000> را باز کنید.

برای خروجی production:

```bash
npm run build
npm start
```

## فعال‌سازی فرم تماس

فرم تماس با سرویس رایگان [Web3Forms](https://web3forms.com) کار می‌کند:

1. در web3forms.com با ایمیل خود یک **Access Key** رایگان بگیرید.
2. در [`data/site.js`](data/site.js) مقدار `web3formsAccessKey` را جایگزین کنید.

تا قبل از تنظیم کلید، ارسال فرم پیام خطا نمایش می‌دهد (رفتار مورد انتظار).

## ساختار پروژه

```
app/                    صفحات (App Router)
├── layout.js           قالب کلی: فونت وزیرمتن، Navbar و Footer
├── page.js             صفحه اصلی (همهٔ بخش‌ها)
├── about/              درباره ما
├── contact/            تماس با ما
├── blog/               فهرست مقالات
├── services/           فهرست خدمات
│   └── [slug]/         صفحهٔ اختصاصی هر سرویس (SSG)
└── not-found.js        صفحهٔ ۴۰۴

components/             کامپوننت‌های UI (Navbar, Hero, Services, Stats, …)
data/site.js            ⭐ تمام محتوای سایت — متن‌ها، آمار، تصاویر، لینک‌ها
```

## سفارشی‌سازی

- **تمام محتوا** (نام شرکت، تلفن، آدرس، خدمات، آمار، نظرات، سوالات متداول، مقالات) در `data/site.js` است؛ کامپوننت‌ها هیچ متن هاردکدی ندارند.
- **رنگ‌های برند** در `tailwind.config.js` (پالت `primary` سرمه‌ای و `accent` کهربایی).
- **تصاویر** از Unsplash بارگذاری می‌شوند؛ برای تصاویر اختصاصی، آدرس‌ها را در `data/site.js` عوض کنید و در صورت نیاز دامنهٔ جدید را به `next.config.mjs` اضافه کنید.

## مسیرهای سایت

| مسیر | توضیح |
| --- | --- |
| `/` | صفحه اصلی: هیرو، خدمات، مزیت‌ها، آمار، روند کار، نظرات، FAQ، وبلاگ، CTA و تماس |
| `/services` | فهرست خدمات |
| `/services/road-transport` | حمل‌ونقل جاده‌ای |
| `/services/international-transport` | لجستیک بین‌المللی |
| `/services/air-freight` | حمل‌ونقل هوایی |
| `/services/sea-freight` | حمل‌ونقل دریایی |
| `/about` | درباره ما |
| `/blog` | وبلاگ |
| `/contact` | تماس با ما |
