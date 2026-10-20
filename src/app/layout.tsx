import type { Metadata, Viewport } from "next";
import "@fontsource-variable/roboto-condensed";
import "@fontsource-variable/onest";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isPublicMode, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Натяжные стены и архитектурный текстиль — OTAGAN VELVET", template: "%s · OTAGAN VELVET" },
  description: "Натяжные стены для дома и коммерческих пространств.",
  applicationName: "OTAGAN VELVET",
  robots: isPublicMode ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },
  openGraph: { type: "website", locale: "ru_RU", siteName: "OTAGAN VELVET", title: "OTAGAN VELVET", description: "Натяжные стены из архитектурного текстиля." }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F5F2ED" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <a className="skipLink" href="#main-content">К основному содержанию</a>
        {!isPublicMode ? <div className="previewNotice"><span>{process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true" ? "ПРЕДВАРИТЕЛЬНАЯ ВЕРСИЯ" : "ЛОКАЛЬНЫЙ ПРЕДПРОСМОТР"}</span><i /> Фотографии объектов и характеристики материалов добавим после подтверждения</div> : null}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
