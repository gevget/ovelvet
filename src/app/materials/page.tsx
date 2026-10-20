import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/materials/");

export default function MaterialsPage() {
  return <PageShell eyebrow="Материалы" title="Фактура, цвет и свет" lead="Визуальные направления помогают сравнить характер переплетения и палитру. Точные названия коллекций, оттенки и характеристики сверим по спецификациям и реальным образцам." slug="materials" cta={{ label: "Обсудить выбор материала", href: "/contacts" }} />;
}
