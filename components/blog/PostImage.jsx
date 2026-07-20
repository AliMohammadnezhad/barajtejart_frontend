"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "/images/post-5-min-1.jpg";

/**
 * next/image با تصویر جایگزین — اگر تصویر شاخص مقاله در دسترس نباشد
 * (حذف شده یا آدرس اشتباه)، به‌جای آیکون شکسته، تصویر پیش‌فرض می‌نشیند.
 */
export default function PostImage({ src, alt, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK);
  return (
    <Image
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== FALLBACK) setCurrentSrc(FALLBACK);
      }}
      {...props}
    />
  );
}
