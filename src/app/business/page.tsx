import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/business/");

export default function BusinessPage() {
  return <PageShell eyebrow="Для бизнеса" title="Архитектурный текстиль для коммерческих пространств" lead="Разберём назначение объекта, техническое задание, условия доступа и этапность до того, как обсуждать конфигурацию и расчёт." slug="business" cta={{ label: "Обсудить объект", href: "/cost?type=business" }} formSource="contact" formAudience="business" />;
}
