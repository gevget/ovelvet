import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { getArticleBody, getVisibleArticles } from "@/lib/content";
import { isPublicMode } from "@/lib/site";
import styles from "./page.module.css";

export function generateStaticParams() { return getVisibleArticles().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getVisibleArticles().find((item) => item.slug === slug);
  if (!article) return { title: "Материал не найден", robots: { index: false, follow: false } };
  const canonical = `/articles/${article.slug}/`;
  return { title: article.title, description: article.description, alternates: { canonical }, robots: isPublicMode ? { index: true, follow: true } : { index: false, follow: false }, openGraph: { type: "article", title: article.title, description: article.description, url: canonical } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getVisibleArticles().find((item) => item.slug === slug);
  const html = await getArticleBody(slug);
  if (!article || html === null) notFound();
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <Link className={styles.back} href="/articles"><ArrowLeft size={15} aria-hidden="true" />Все статьи</Link>
      <article><header className={styles.header}><p className="eyebrow"><span className="eyebrowLine" />Материал / OTAGAN VELVET</p><h1>{article.title}</h1><p>{article.description}</p></header><MarkdownContent html={html} className={styles.body} />
        <div className={styles.cta}><div><span>СЛЕДУЮЩИЙ ШАГ</span><h2>Обсудить проект</h2><p>Поделитесь параметрами помещения — площадь можно уточнить позже.</p></div><Link className="button buttonDark" href="/cost">К форме расчёта <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </article>
    </main>
  );
}
