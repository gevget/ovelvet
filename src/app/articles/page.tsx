import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getVisibleArticles } from "@/lib/content";
import { isPublicMode, metadataFor } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = { ...metadataFor("/articles/"), ...(isPublicMode && getVisibleArticles().length === 0 ? { robots: { index: false, follow: false } } : {}) };

export default function ArticlesPage() {
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <header className={styles.header}><p className="eyebrow"><span className="eyebrowLine" />База знаний</p><h1>Материалы о натяжных стенах</h1><p>Уход, подготовка поверхности, устройство системы и монтаж. Характеристики выбранного решения сверяйте с документацией на материал и конструкцию.</p></header>
      <div className={styles.articleList}>{getVisibleArticles().map((article, index) => <article className={styles.articleItem} key={article.slug}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><div><span className={styles.topic}>{article.topic}</span><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2><p>{article.description}</p></div><Link className={styles.openLink} href={`/articles/${article.slug}`} aria-label={`Читать: ${article.title}`}><ArrowUpRight size={20} aria-hidden="true" /></Link></article>)}</div>
      <p className={styles.note}>Технические особенности нужно сверять с документацией выбранного материала и конструкции.</p>
    </main>
  );
}
