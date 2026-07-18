# Postman Collection — وب‌هوک وبلاگ باراج تجارت

فایل‌های این پوشه را در Postman ایمپورت کنید (`Import` → انتخاب هر سه فایل):

| فایل | کاربرد |
| --- | --- |
| `BarajTejarat-Blog-Webhook.postman_collection.json` | کالکشن اصلی (۳ پوشه، ۱۲ درخواست، تست خودکار) |
| `BarajTejarat-Production.postman_environment.json` | محیط production — مقدار `webhookSecret` را از سرور بردارید |
| `BarajTejarat-Local.postman_environment.json` | محیط توسعهٔ محلی (`npm run dev`) |

## شروع سریع

1. Environment مناسب را از منوی بالا-راست Postman انتخاب کنید.
2. در Environment مقدار **`webhookSecret`** را وارد کنید
   (production: از `/var/www/barajtejarat/.env.production` روی سرور).
3. درخواست‌های پوشهٔ **«1) Blog Post CRUD»** را به‌ترتیب اجرا کنید:
   Create → Update → Deactivate → Activate → Delete.
   اسلاگ تستی به‌صورت خودکار ساخته می‌شود (`postman-test-<timestamp>`)
   و تست‌های هر درخواست در تب **Test Results** پاس/فیل را نشان می‌دهند.
4. پوشهٔ **«2) Verification»** صفحهٔ واقعی مقاله و sitemap را چک می‌کند.
5. پوشهٔ **«3) Error Cases»** رفتار خطاها (401/404/422) را می‌سنجد.

## اجرای خودکار با CLI (newman)

```bash
npx newman run BarajTejarat-Blog-Webhook.postman_collection.json \
  -e BarajTejarat-Local.postman_environment.json \
  --folder "1) Blog Post CRUD" --folder "3) Error Cases"
```

> پوشهٔ Verification برای اجرای تعاملی طراحی شده (بعد از Deactivate باید
> 404 و بعد از Activate باید 200 بگیرید) و در اجرای یک‌جای newman معنا ندارد.
