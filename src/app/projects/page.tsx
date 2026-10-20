import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { isPublicMode, metadataFor } from "@/lib/site";
import { previewProjects } from "@/lib/projects";
import styles from "./page.module.css";

export const metadata: Metadata = { ...metadataFor("/projects/"), robots: { index: false, follow: false } };

export default function ProjectsPage() {
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow"><span className="eyebrowLine" />Проекты</p>
        <h1>Интерьеры и детали</h1>
        {isPublicMode
          ? <p>Материалы портфолио готовятся. Публикация примеров появится после проверки фотографий объектов и прав на их использование.</p>
          : <p>В локальном предпросмотре — две концептуальные визуализации по предоставленным фотографиям объектов. Названия сохранены; сами изображения не являются снимками готовых интерьеров.</p>}
      </header>
      {isPublicMode ? <section className={styles.status} aria-labelledby="portfolio-status">
        <span>ПОРТФОЛИО / ГОТОВИТСЯ</span>
        <div><h2 id="portfolio-status">Материалы появятся после подтверждения</h2><p>Реальные фотографии и описания добавим после проверки и согласования.</p></div>
        <Link className="button buttonDark" href="/cost">Рассказать о проекте <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </section> : <section className={styles.projectGrid} aria-label="Визуальные примеры проектов">
        {previewProjects.map((project, index) => <article className={styles.projectCard} key={project.slug}>
          <Link href={`/projects/${project.slug}/` as Route} className={styles.projectLink}>
            <div className={styles.projectVisual}><PlaceholderMedia slot={project.imageSlot} sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1344px) 45vw, 600px" showCaption={false} priority={index === 0} /><span className={styles.projectMarker}>ВИЗУАЛИЗАЦИЯ ПО ФОТО ОБЪЕКТА</span></div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span className={styles.projectMore}>О проекте <ArrowUpRight size={15} aria-hidden="true" /></span>
          </Link>
        </article>)}
      </section>}
    </main>
  );
}
