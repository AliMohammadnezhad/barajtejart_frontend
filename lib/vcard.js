import { businessCard, siteConfig, siteUrl } from "@/data/site";

// ساخت رشتهٔ vCard 3.0 برای کد QR کارت ویزیت —
// اسکن کد، مخاطب را با اطلاعات تماس شرکت در گوشی ذخیره می‌کند.
export function buildBusinessCardVcard() {
  const { ceo } = businessCard;
  const tel = siteConfig.phoneLink.replace("tel:", "");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N;CHARSET=UTF-8:${ceo.nameFa};;;;`,
    `FN;CHARSET=UTF-8:${ceo.nameFa} | ${ceo.nameEn}`,
    `ORG;CHARSET=UTF-8:${businessCard.companyFa};${businessCard.companyEn}`,
    `TITLE;CHARSET=UTF-8:${ceo.roleFa} | ${ceo.roleEn}`,
    `TEL;TYPE=CELL,VOICE:${tel}`,
    `EMAIL;TYPE=INTERNET:${siteConfig.email}`,
    `URL:${siteUrl}`,
    `ADR;CHARSET=UTF-8:;;${siteConfig.address};;;;`,
    `NOTE;CHARSET=UTF-8:${businessCard.tagline}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}
