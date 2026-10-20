import { readFile } from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { isPublicMode } from "@/lib/site";

const contentRoot = path.join(process.cwd(), "03_CONTENT_SEO");

export type ArticleEntry = { slug: string; file: string; title: string; description: string; topic: string; status: "draft" | "published"; related: string[] };

export const articleCatalog: ArticleEntry[] = [
  { slug: "care", file: "01_CARE.md", title: "Как ухаживать за натяжными стенами", description: "Уход за архитектурным текстилем с учётом рекомендаций для конкретного полотна.", topic: "Уход и эксплуатация", status: "draft", related: ["/materials/", "/technology/"] },
  { slug: "business", file: "02_BUSINESS.md", title: "Натяжные стены для коммерческих помещений: что учитывать", description: "Материалы, требования объекта, этапность и эксплуатация коммерческих пространств.", topic: "Для бизнеса", status: "draft", related: ["/business/", "/cost/"] },
  { slug: "wall-preparation", file: "03_WALL_PREPARATION.md", title: "Выравнивание стен без штукатурки: как работает натяжная система", description: "Как конструкция формирует ровную видимую плоскость и что проверить перед монтажом.", topic: "Технология", status: "draft", related: ["/stretch-walls/", "/technology/"] },
  { slug: "technology", file: "04_TECHNOLOGY.md", title: "Как устроены натяжные стены: конструкция и монтаж", description: "Принцип конструкции, интеграции, текстиль и акустические ограничения.", topic: "Технология", status: "draft", related: ["/technology/", "/cost/"] },
  { slug: "repair", file: "05_REPAIR.md", title: "Что делать, если натяжная стена повреждена", description: "Варианты оценки и восстановления текстильного полотна.", topic: "Уход и эксплуатация", status: "draft", related: ["/technology/", "/contacts/"] },
  { slug: "installation-time", file: "06_INSTALLATION_TIME.md", title: "Сколько времени занимает монтаж натяжных стен", description: "Факторы, которые влияют на сроки подготовки и монтажа.", topic: "Планирование", status: "draft", related: ["/business/", "/cost/"] }
];

export function getVisibleArticles() {
  return isPublicMode ? articleCatalog.filter((article) => article.status === "published") : articleCatalog;
}

const pageFiles: Record<string, string> = {
  "stretch-walls": "01_STRETCH_WALLS.md",
  home: "02_HOME.md",
  business: "03_BUSINESS.md",
  technology: "04_TECHNOLOGY.md",
  designers: "06_DESIGNERS.md",
  materials: "09_MATERIALS.md",
  about: "11_ABOUT.md"
};

function visibleMarkdown(source: string, includeTitle = false) {
  const lines = source
    .replace(/\s*Не создавать несуществующую библиотеку CAD\/BIM-файлов и не обещать бесплатные образцы по умолчанию\./giu, "")
    .replace(/\r/g, "")
    .split("\n");
  const titleIndex = lines.findIndex((line) => /^#\s+[^#]/.test(line));
  const selected = lines.slice(titleIndex < 0 ? 0 : titleIndex + (includeTitle ? 0 : 1));
  const output: string[] = [];
  let skipSection = false;

  for (const line of selected) {
    if (/^##\s+Связь с OTAGAN/i.test(line) || /^##\s+Команда, процессы и документы/i.test(line) || /^##\s+Крупные изображения — главный аргумент/i.test(line)) {
      skipSection = true;
      continue;
    }
    if (/^##\s+/.test(line)) skipSection = false;
    if (skipSection) continue;
    if (/^\*\*(Маршрут|Интент|Источник|Статус|PUBLISH GATE|SOURCE GAP|EDITORIAL NOTE|Медиа|Изображение|CTA|Нельзя):?\*\*/i.test(line)) continue;
    if (/^<[^>]+>/.test(line) || /<VERIFY:|<ПОЛЯ|TODO: VERIFY|PUBLISH GATE|EDITORIAL NOTE/i.test(line)) continue;
    if (/^\*\*Контентный слот:\*\*/i.test(line)) continue;
    output.push(line);
  }

  return output.join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^## [^\n]+\n(?=(?:[ \t]*\n)*## )/gm, "")
    .trim();
}

export async function renderMarkdownFile(relativeFile: string, collection: "pages" | "articles") {
  const source = await readFile(path.join(contentRoot, collection, relativeFile), "utf8");
  const markdown = visibleMarkdown(source);
  return markdownToSafeHtml(markdown);
}

async function markdownToSafeHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

export type PageSection = { heading: string; html: string };

export async function getPageSections(slug: keyof typeof pageFiles): Promise<PageSection[]> {
  const source = await readFile(path.join(contentRoot, "pages", pageFiles[slug]), "utf8");
  const markdown = visibleMarkdown(source);
  const lines = markdown.replace(/\r/g, "").split("\n");
  const sections: PageSection[] = [];
  let heading = "";
  let body: string[] = [];

  const save = async () => {
    if (!heading || !body.join("\n").trim()) return;
    sections.push({ heading, html: await markdownToSafeHtml(body.join("\n").trim()) });
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      await save();
      heading = match[1];
      body = [];
    } else if (heading) {
      body.push(line);
    }
  }
  await save();
  return sections;
}

export async function getPageBody(slug: keyof typeof pageFiles) {
  return renderMarkdownFile(pageFiles[slug], "pages");
}

export async function getArticleBody(slug: string) {
  const article = getVisibleArticles().find((entry) => entry.slug === slug);
  if (!article) return null;
  return renderMarkdownFile(article.file, "articles");
}
