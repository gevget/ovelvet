import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/technology/");

export default function TechnologyPage() {
  return <PageShell eyebrow="Конструкция" title="Как устроены натяжные стены" lead="Профиль формирует контур, текстиль — видимую поверхность. Узлы, дополнительное наполнение и интеграции рассматриваются для конкретного проекта." slug="technology" cta={{ label: "Задать вопрос о конструкции", href: "/contacts" }} />;
}
