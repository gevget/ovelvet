import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { getWorkExample, previewProjects } from "@/lib/projects";
import { isPublicMode } from "@/lib/site";
import styles from "../page.module.css";

export function generateStaticParams() {
  return previewProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkExample(slug);
  return {
    title: project ? `${project.title} · OTAGAN VELVET` : "Проект · OTAGAN VELVET",
    description: project?.description ?? "Концептуальная визуализация проекта.",
    robots: { index: false, follow: false }
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getWorkExample(slug);
  if (!project || !previewProjects.some((preview) => preview.slug === slug) || isPublicMode) notFound();

  return (
    <main id="main-content" className={`container ${styles.detailPage}`}>
      <div className={styles.detailHero}>
        <div className={styles.detailText}>
          <span>ВИЗУАЛИЗАЦИЯ ПО ФОТО ОБЪЕКТА</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <Link href="/projects"><ArrowLeft size={16} aria-hidden="true" />К примерам</Link>
        </div>
        <PlaceholderMedia slot={project.imageSlot} showCaption={false} priority />
      </div>
      <p className={styles.detailNote}>Изображение — новый концептуальный рендер по фотографии объекта из предоставленного архива. Это не фотография результата; оттенки и детали визуализации могут отличаться от исходного интерьера.</p>
    </main>
  );
}
