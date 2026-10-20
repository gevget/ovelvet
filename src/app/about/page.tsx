import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = { ...metadataFor("/about/"), robots: { index: false, follow: false } };

export default function AboutPage() {
  return <PageShell eyebrow="О компании" title="Инженерный подход к архитектурному текстилю" lead="OTAGAN VELVET — направление OTAGAN, которое работает с натяжными стенами и интерьерным текстилем. Конструкция, материал и детали рассматриваются вместе с задачей помещения." slug="about" cta={{ label: "Обсудить проект", href: "/contacts" }} />;
}
