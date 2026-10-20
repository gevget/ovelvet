import Link from "next/link";
import { Anchor, ArrowRight, ArrowUpRight, BedDouble, BrickWall, Building, Cable, Camera, CalendarDays, ChevronDown, Clapperboard, DraftingCompass, Eye, FileCheck, FileText, Hand, Hotel, House, Layers3, Map, Monitor, Palette, PanelsTopLeft, Plug, Ruler, Shapes, ShieldCheck, Sofa, UserRound, Users, Utensils, Workflow, type LucideIcon } from "lucide-react";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { getPageSections, type PageSection } from "@/lib/content";
import { isPublicMode } from "@/lib/site";
import { LeadForm } from "@/components/lead-form";
import type { MediaSlot } from "@/lib/media";
import styles from "./page-shell.module.css";

type PageSlug = "stretch-walls" | "home" | "business" | "technology" | "designers" | "materials" | "about";
type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  slug: PageSlug;
  media?: MediaSlot;
  cta?: { label: string; href: "/cost" | "/cost?type=home" | "/cost?type=business" | "/contacts" | "#page-form-heading" };
  formSource?: "contact" | "designer";
  formAudience?: "home" | "business" | "both";
};

type Layout = "default" | "cards" | "checklist" | "comparison" | "factors" | "steps" | "faq" | "sentences" | "materialFactors" | "materialsCatalog" | "designerQuestions" | "designerMaterials";
type Entry = { html: string; label?: string };

function paragraphContents(html: string) {
  return [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
}

function paragraphLines(html: string): string[] {
  const paragraphs = paragraphContents(html);
  if (paragraphs.length !== 1 || !/<br\s*\/?>/i.test(paragraphs[0])) return [];
  return paragraphs[0].split(/<br\s*\/?>/i).map((line) => line.trim()).filter(Boolean);
}

function labelledSegments(html: string): string[] {
  const firstParagraph = paragraphContents(html)[0] ?? "";
  if (!firstParagraph.includes("<strong>")) return [];
  const parts = firstParagraph.split(/(?=<strong>)/).map((part) => part.trim()).filter(Boolean);
  const labelled = parts.filter((part) => part.startsWith("<strong>"));
  return labelled.length > 1 ? labelled : [];
}

function labelledParagraphs(html: string): Array<{ label: string; html: string }> {
  return paragraphContents(html)
    .flatMap((paragraph) => paragraph.split(/<br\s*\/?\s*>/i))
    .flatMap((segment) => {
      const match = segment.trim().match(/^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/);
      if (!match) return [];
      return [{ label: match[1].replace(/[.:]\s*$/u, ""), html: match[2].trim() }];
    });
}

function layoutFor(slug: PageSlug, heading: string): Layout {
  const normalized = heading.toLocaleLowerCase("ru");
  if (slug === "about" && normalized.includes("наш рабочий подход")) return "cards";
  if (normalized.includes("частые вопросы")) return "faq";
  if (slug === "materials" && normalized.includes("как выбрать фактуру")) return "materialFactors";
  if (slug === "materials" && normalized.includes("каталог материалов")) return "materialsCatalog";
  if (slug === "designers" && normalized.includes("какие вопросы решаем вместе")) return "designerQuestions";
  if (slug === "designers" && normalized.includes("проектные материалы")) return "designerMaterials";
  if (slug === "designers" && (normalized.includes("материал и архитектура") || normalized.includes("как начинаем сотрудничество"))) return "sentences";
  if (slug === "stretch-walls" && normalized.includes("чем отличаются")) return "comparison";
  if ((slug === "stretch-walls" && normalized.includes("продумать")) ||
      (slug === "business" && normalized.includes("что важно"))) return "cards";
  if ((slug === "stretch-walls" && normalized.includes("где натяжные стены")) ||
      (slug === "home" && normalized.includes("для каких комнат")) ||
      (slug === "business" && normalized.includes("где применяется")) ||
      (slug === "technology" && normalized.includes("из каких элементов"))) return "cards";
  if ((slug === "home" && normalized.includes("практические вопросы")) ||
      (slug === "business" && normalized.includes("что прислать"))) return slug === "business" ? "checklist" : "sentences";
  if ((slug === "stretch-walls" && normalized.includes("что учитывать")) ||
      (slug === "business" && normalized.includes("монтаж без традиционной")) ||
      (slug === "technology" && normalized.includes("розетки, свет"))) return "sentences";
  if ((slug === "stretch-walls" && normalized.includes("стоимость")) ||
      (slug === "home" && normalized.includes("зависит стоимость"))) return "factors";
  if ((slug === "home" && normalized.includes("как проходит работа")) ||
      (slug === "business" && normalized.includes("путь от тз")) ||
      (slug === "technology" && normalized.includes("как проходит монтаж"))) return "steps";
  if (slug === "technology" && normalized.includes("акустика")) return "comparison";
  return "default";
}

function entriesFor(section: PageSection, layout: Layout, slug: PageSlug): Entry[] {
  if (layout === "faq") return paragraphLines(section.html).map((html) => ({ html }));
  if (layout === "comparison") {
    const chunks = labelledSegments(section.html);
    if (chunks.length > 1) return chunks.map((html) => ({ html }));
    const lines = paragraphLines(section.html);
    if (lines.length >= 2) return lines.map((html) => ({ html }));
  }
  if (layout === "cards") {
    const listItems = [...section.html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1].trim());
    if (listItems.length > 1) return listItems.map((html) => ({ html }));
    const lines = paragraphLines(section.html);
    if (lines.length > 1) return lines.map((html) => ({ html }));
  }
  if (layout === "checklist") {
    const paragraph = paragraphContents(section.html)[0] ?? "";
    const [fields = "", note = ""] = paragraph.split(/\.\s+(?=Если)/u, 2);
    const entries = fields.split(",").map((html) => html.replace(/\.$/, "").trim()).filter(Boolean).map((html) => ({ html }));
    return entries.length > 1 ? entries : note ? [{ html: paragraph }] : [];
  }
  if (layout === "factors") {
    const paragraph = paragraphContents(section.html)[0] ?? "";
    const firstSentence = paragraph.match(/^[\s\S]*?\./u)?.[0] ?? "";
    const plainSentence = firstSentence.replace(/<[^>]*>/g, "");
    const factorList = slug === "stretch-walls"
      ? plainSentence.match(/Цена зависит от (.+)$/u)?.[1]
      : plainSentence.match(/На стоимость влияют (.+)$/u)?.[1]?.replace(/^не только /u, "").replace(/, но и /u, ", ");
    const factors = factorList?.replace(/\.$/u, "").split(/,\s*|\s+и\s+/u).map((factor) => factor.trim()).filter(Boolean) ?? [];
    const stretchFactorLabels: Record<string, string> = {
      "площади": "Площадь",
      "геометрии": "Геометрия",
      "материала": "Материал",
      "числа узлов": "Число узлов",
      "условий монтажа": "Условия монтажа"
    };
    return factors.map((label) => ({ html: "", label: stretchFactorLabels[label.toLocaleLowerCase("ru")] ?? `${label.charAt(0).toLocaleUpperCase("ru")}${label.slice(1)}` }));
  }
  if (layout === "steps") {
    const listItems = [...section.html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1].trim());
    if (listItems.length > 1) return listItems.map((html) => ({ html }));
    const paragraph = paragraphContents(section.html)[0] ?? "";
    const sequence = paragraph.split(/\s*→\s*/).map((part) => part.trim()).filter(Boolean).map((part) => `${part.charAt(0).toLocaleUpperCase("ru")}${part.slice(1)}`);
    if (sequence.length > 1) return sequence.map((html) => ({ html }));
  }
  if (layout === "sentences") {
    const paragraphs = paragraphContents(section.html);
    if (paragraphs.length > 1) return paragraphs.map((html) => ({ html }));
    const text = paragraphs[0] ?? "";
    const sentences = text.split(/(?<=[.!?])\s+(?=[А-ЯЁ])/u).map((part) => part.trim()).filter(Boolean);
    if (sentences.length > 1) {
      const labelsByPage: Partial<Record<PageSlug, string[]>> = {
        home: ["Планирование деталей", "Уход за материалом", "Бытовые сценарии"],
        ["stretch-walls"]: ["Зоны и нагрузка", "Параметры материала", "Узлы объекта"],
        business: ["Этапность работ", "Подготовка и монтаж", "Согласование графика"],
        technology: ["Планирование узлов", "Несущие элементы", "Рабочие чертежи"],
        designers: section.heading.toLocaleLowerCase("ru").includes("материал и архитектура")
          ? ["Контекст пространства", "Палитра проекта"]
          : ["Исходные материалы", "Проектное обсуждение"]
      };
      return sentences.map((html, index) => ({ html, label: labelsByPage[slug]?.[index] }));
    }
  }
  return [];
}

function iconsForSection(slug: PageSlug, heading: string): LucideIcon[] | null {
  const normalized = heading.toLocaleLowerCase("ru");
  if (slug === "designers" && normalized.includes("материал и архитектура")) return [Eye, Palette];
  if (slug === "stretch-walls" && normalized.includes("чем отличаются")) return [Layers3, Palette, PanelsTopLeft];
  if (slug === "stretch-walls" && normalized.includes("продумать")) return [Palette, Plug, Ruler, Layers3];
  if (slug === "stretch-walls" && normalized.includes("где натяжные стены")) return [House, Building];
  if (slug === "stretch-walls" && normalized.includes("что учитывать")) return [Ruler, Layers3, Cable];
  if (slug === "stretch-walls" && normalized.includes("стоимость")) return [Ruler, Shapes, Layers3, Cable, Building];
  if (slug === "home" && normalized.includes("для каких комнат")) return [Sofa, BedDouble, Monitor, Clapperboard];
  if (slug === "home" && normalized.includes("практические вопросы")) return [DraftingCompass, Hand, House];
  if (slug === "home" && normalized.includes("стоимость")) return [Ruler, Shapes, Layers3, Cable, Building];
  if (slug === "business" && normalized.includes("где применяется")) return [Building, Hotel, Utensils, Users];
  if (slug === "business" && normalized.includes("что важно")) return [CalendarDays, DraftingCompass, Layers3, FileCheck];
  if (slug === "business" && normalized.includes("что прислать")) return [Map, Ruler, Camera, Palette, CalendarDays, ShieldCheck, UserRound];
  if (slug === "technology" && normalized.includes("из каких элементов")) return [BrickWall, Ruler, PanelsTopLeft, Layers3];
  if (slug === "technology" && normalized.includes("розетки, свет")) return [Plug, Anchor, FileText];
  return null;
}

function RichBlock({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function ContentLayout({ section, layout, slug }: { section: PageSection; layout: Layout; slug: PageSlug }) {
  if (slug === "materials" && layout === "materialFactors") {
    const icons = [Eye, Palette, Ruler, Hand];
    return <div className={styles.materialFactors}>
      {labelledParagraphs(section.html).slice(0, 4).map((entry, index) => {
        const Icon = icons[index] ?? Eye;
        return <article className={styles.materialFactor} key={`${entry.label}-${index}`}>
          <span className={styles.materialFactorIcon}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
          <div className={styles.materialFactorCopy}>
            <h3>{entry.label}</h3>
            <p dangerouslySetInnerHTML={{ __html: entry.html }} />
          </div>
          <span className={styles.materialFactorIndex}>{String(index + 1).padStart(2, "0")}</span>
        </article>;
      })}
    </div>;
  }

  if (slug === "materials" && layout === "materialsCatalog") {
    if (isPublicMode) return null;
    const samples: Array<{ slot: MediaSlot; number: string }> = [
      { slot: "materialSampleOne", number: "01" },
      { slot: "materialSampleTwo", number: "02" },
      { slot: "materialSampleThree", number: "03" },
      { slot: "materialSampleFour", number: "04" }
    ];
    return <div className={styles.materialCatalog}>
      {samples.map((sample) => <article className={styles.materialCatalogCard} key={sample.number}>
        <PlaceholderMedia slot={sample.slot} sizes="112px" className={styles.materialCatalogImage} showCaption={false} />
        <div className={styles.materialCatalogCopy}>
          <span>ВИЗУАЛИЗАЦИЯ · НЕ ОБРАЗЕЦ</span>
          <h3>Фактура {sample.number}</h3>
          <p>Коллекцию, точный оттенок и характеристики подтвердим по спецификации материала.</p>
        </div>
      </article>)}
    </div>;
  }

  if (slug === "designers" && layout === "designerQuestions") {
    const icons = [Palette, DraftingCompass, Layers3, Workflow];
    return <div className={styles.designerQuestionGrid}>
      {labelledParagraphs(section.html).slice(0, 4).map((entry, index) => {
        const Icon = icons[index] ?? FileText;
        return <article className={styles.designerQuestion} key={`${entry.label}-${index}`}>
          <span className={styles.designerQuestionIcon}><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span>
          <span className={styles.designerQuestionIndex}>{String(index + 1).padStart(2, "0")}</span>
          <h3>{entry.label}</h3>
          <p dangerouslySetInnerHTML={{ __html: entry.html }} />
        </article>;
      })}
    </div>;
  }

  if (slug === "designers" && layout === "designerMaterials") {
    return <div className={styles.designerMaterials}><span className={styles.designerMaterialsIcon}><FileText size={22} strokeWidth={1.6} aria-hidden="true" /></span><div dangerouslySetInnerHTML={{ __html: section.html }} /></div>;
  }

  if (slug === "technology" && layout === "comparison" && section.heading.toLocaleLowerCase("ru").includes("акустика")) {
    const paragraph = paragraphContents(section.html)[0] ?? "";
    const end = paragraph.indexOf("</strong>.");
    const note = end >= 0 ? paragraph.slice(end + "</strong>.".length).trim() : "";
    return <div className={styles.acousticContent}>
      <div className={styles.acousticPair}>
        <div><span>01 / ВНУТРИ КОМНАТЫ</span><p>Поглощение отражённого звука</p></div>
        <div><span>02 / МЕЖДУ ПОМЕЩЕНИЯМИ</span><p>Звукоизоляция от соседей</p></div>
      </div>
      <p className={styles.acousticNote} dangerouslySetInnerHTML={{ __html: note }} />
    </div>;
  }

  const sequenceParagraph = layout === "steps" && slug === "home" ? paragraphContents(section.html)[0] ?? "" : "";
  const sequenceNoteMatch = sequenceParagraph.match(/\.\s*(Финальные сроки[\s\S]*)$/u);
  const sequenceNote = sequenceNoteMatch?.[1] ?? "";
  const entrySection = sequenceNoteMatch ? { ...section, html: section.html.replace(sequenceNoteMatch[0], "") } : section;
  const entries = entriesFor(entrySection, layout, slug);
  if (!entries.length) return <div className={styles.sectionContent} dangerouslySetInnerHTML={{ __html: section.html }} />;
  const entryIcons = iconsForSection(slug, section.heading);

  if (layout === "faq") {
    return <div className={styles.faqList}>
      {entries.map((entry, index) => {
        const match = entry.html.match(/^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/);
        return <details className={styles.faqItem} key={`${section.heading}-${index}`}>
          <summary><span dangerouslySetInnerHTML={{ __html: match?.[1] ?? `Вопрос ${index + 1}` }} /><ChevronDown size={18} aria-hidden="true" /></summary>
          <div className={styles.faqAnswer}><RichBlock html={match?.[2] || entry.html} /></div>
        </details>;
      })}
    </div>;
  }

  const gridClass = layout === "steps" ? styles.stepGrid : layout === "comparison" ? styles.comparisonGrid : layout === "checklist" ? styles.checklistGrid : styles.cardGrid;
  const factorParagraph = paragraphContents(section.html)[0] ?? "";
  const factorSentence = factorParagraph.match(/^[\s\S]*?\./u)?.[0] ?? "";
  const factorNote = factorParagraph.replace(factorSentence, "").replace(/(<\/a>)\./g, "$1").trim();
  const remaining = sequenceNote
    ? [sequenceNote]
    : layout === "factors"
      ? factorNote ? [factorNote] : []
    : layout === "comparison" && slug === "stretch-walls"
      ? paragraphContents(section.html).slice(1)
      : layout === "checklist"
        ? paragraphContents(section.html)[0]?.match(/\.\s+(Если[\s\S]*)$/u)?.slice(1) ?? []
        : [];
  return <>
    <div className={`${styles.entryGrid} ${gridClass}`}>
      {entries.map((entry, index) => {
        const Icon = entryIcons?.[index];
        return <article className={styles.entry} key={`${section.heading}-${index}`}>
        {Icon ? <span className={styles.entryIcon}><Icon className={styles.entryIconGlyph} strokeWidth={1.5} aria-hidden="true" /></span> : <span className={styles.entryNumber}>{String(index + 1).padStart(2, "0")}</span>}
        {entry.label ? <h3 className={styles.entryLabel}>{entry.label}</h3> : null}
        <RichBlock html={entry.html} />
      </article>;
      })}
    </div>
    {remaining.map((html, index) => <p className={styles.cardFootnote} key={`footnote-${index}`} dangerouslySetInnerHTML={{ __html: html }} />)}
  </>;
}

function StorySections({ slug, sections }: { slug: PageSlug; sections: PageSection[] }) {
  const visibleSections = slug === "materials" && isPublicMode
    ? sections.filter((section) => !section.heading.toLocaleLowerCase("ru").includes("каталог материалов"))
    : sections;
  return <div className={styles.story}>
    {visibleSections.map((section, index) => {
      const layout = layoutFor(slug, section.heading);
      const featured = index === 0;
      const roomSection = slug === "home" && section.heading.toLocaleLowerCase("ru").includes("для каких комнат");
      return <div key={`${section.heading}-${index}`}>
        <section className={`container ${styles.storySection} ${featured ? styles.storyIntro : ""}`} aria-labelledby={`story-${slug}-${index}`}>
          <div className={styles.storyLabel}>
            <span className={styles.storyIndex}>{String(index + 1).padStart(2, "0")} <i>/ {String(visibleSections.length).padStart(2, "0")}</i></span>
            <span className={styles.storyRule} aria-hidden="true" />
          </div>
          <div className={styles.storyMain}>
            <h2 id={`story-${slug}-${index}`}>{section.heading}</h2>
            <ContentLayout section={section} layout={layout} slug={slug} />
          </div>
        </section>
        {slug === "stretch-walls" && index === 1 ? <section className={`container ${styles.diagramFeature}`} aria-labelledby="stretch-diagram-heading">
          <div className={styles.diagramCopy}><p className="eyebrow"><span className="eyebrowLine" />Схема конструкции</p><h2 id="stretch-diagram-heading">Стена в разрезе</h2><p>Условная схема показывает основные слои. Конфигурация уточняется для конкретного проекта.</p><Link href="/technology" className={styles.textLink}>Подробнее о технологии <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <PlaceholderMedia slot="technologyCutaway" sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 900px) 55vw, 63vw" label="КОНЦЕПТУАЛЬНАЯ ВИЗУАЛИЗАЦИЯ / принцип конструкции" />
        </section> : null}
        {roomSection && !isPublicMode ? <section className={`container ${styles.homeGallery}`} aria-label="Подготовка фотоматериалов">
          <div className={styles.galleryHeading}><p className="eyebrow"><span className="eyebrowLine" />Интерьер и фактура</p><p>Три концепта показывают разные сочетания текстиля, цвета и света. Это визуализации интерьеров, а не фотографии выполненных объектов.</p></div>
          <div className={styles.galleryGrid}>
            <PlaceholderMedia slot="homeGalleryOne" sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1344px) 24vw, 320px" />
            <PlaceholderMedia slot="homeGalleryTwo" sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1344px) 24vw, 320px" />
            <PlaceholderMedia slot="homeGalleryThree" sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1344px) 24vw, 320px" />
          </div>
        </section> : null}
      </div>;
    })}
  </div>;
}

export async function PageShell({ eyebrow, title, lead, slug, media, cta, formSource, formAudience = "both" }: Props) {
  const sections = await getPageSections(slug);
  const mediaByPage: Record<PageSlug, MediaSlot> = {
    "stretch-walls": "productHero",
    home: "homeAudienceHero",
    business: "businessHero",
    technology: "technologyCutaway",
    designers: "designerDetails",
    materials: "materialTexture",
    about: "aboutProcess"
  };
  const heroSlot = media ?? mediaByPage[slug];
  const pageVariant = styles[slug] ?? "";
  const heroMediaWidths: Record<PageSlug, string> = {
    "stretch-walls": "55vw",
    home: "62vw",
    business: "56vw",
    technology: "60vw",
    designers: "50vw",
    materials: "40vw",
    about: "56vw"
  };
  const heroMediaSizes = `(max-width: 767px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 64px), ${heroMediaWidths[slug]}`;

  return <main id="main-content" className={`${styles.page} ${pageVariant}`}>
    <div className={`container ${styles.hero}`}>
      <div className={styles.heroText}>
        <p className="eyebrow"><span className="eyebrowLine" />{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {cta ? <Link className="button buttonDark" href={cta.href}>{cta.label}<ArrowUpRight size={17} aria-hidden="true" /></Link> : null}
      </div>
      <PlaceholderMedia slot={heroSlot} sizes={heroMediaSizes} priority label="PHOTO PLACEHOLDER / визуальный материал будет добавлен" />
    </div>
    <StorySections slug={slug} sections={sections} />
    {formSource ? <section className={`container ${styles.formSection}`} aria-labelledby="page-form-heading"><div><p className="eyebrow"><span className="eyebrowLine" />Демо-форма</p><h2 id="page-form-heading">Обсудить задачу</h2><p>Проверьте форму на тестовых данных. Запрос не передаётся владельцу и не сохраняется.</p></div><LeadForm source={formSource} audience={formAudience} /></section> : null}
  </main>;
}
