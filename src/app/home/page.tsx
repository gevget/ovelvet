import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/home/");

export default function HomeAudiencePage() {
  return <PageShell eyebrow="Для дома" title="Текстильные стены в личном пространстве" lead="Фактура, свет и бытовые сценарии — исходные точки для разговора о решении в квартире или загородном доме." slug="home" cta={{ label: "Рассчитать проект", href: "/cost?type=home" }} />;
}
