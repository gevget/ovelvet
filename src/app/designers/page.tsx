import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/designers/");

export default function DesignersPage() {
  return <PageShell eyebrow="Для специалистов" title="Архитектурный текстиль в проекте интерьера" lead="Дизайнерам и архитекторам: обсудим фактуру, примыкания, интеграции и ограничения до передачи решения в реализацию." slug="designers" cta={{ label: "Обсудить проект", href: "#page-form-heading" }} formSource="designer" />;
}
