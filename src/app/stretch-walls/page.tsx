import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { metadataFor } from "@/lib/site";

export const metadata: Metadata = metadataFor("/stretch-walls/");

export default function StretchWallsPage() {
  return <PageShell eyebrow="Продукт" title="Натяжные стены из архитектурного текстиля" lead="Текстильное полотно фиксируется в профильной системе и формирует ровную декоративную поверхность. Конфигурацию уточняют под помещение и выбранный материал." slug="stretch-walls" cta={{ label: "Обсудить проект", href: "/cost" }} />;
}
