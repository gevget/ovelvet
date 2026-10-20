import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Layers3, Ruler, Sofa, Sparkles, ThermometerSun, VolumeX } from "lucide-react";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { workExamples } from "@/lib/projects";
import { isPublicMode, routeMeta } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: routeMeta["/"].title,
  description: routeMeta["/"].description,
  alternates: { canonical: "/" }
};

const questions = [
  { q: "Подойдут ли натяжные стены для неровного основания?", a: "Конструкция может формировать ровную видимую плоскость без традиционного штукатурного выравнивания. Возможность монтажа и способ крепления уточняются по состоянию основания." },
  { q: "Можно ли предусмотреть розетки и выключатели?", a: "Расположение и узлы электроточек планируются до монтажа. Конкретное решение согласуется с выбранной системой и помещением." },
  { q: "Как ухаживать за текстильной поверхностью?", a: "Способ ухода зависит от конкретного полотна. Рекомендации производителя важно получить вместе с выбранным материалом." },
  { q: "Можно ли заменить повреждённое полотно?", a: "Возможность замены зависит от конструкции, зоны повреждения и доступности соответствующего текстиля." },
  { q: "Помогает ли система от шума соседей?", a: "Звукопоглощение внутри комнаты и звукоизоляция между помещениями — разные задачи. Эффект определяют характеристики конкретной конструкции." },
  { q: "Сколько длится монтаж?", a: "Срок зависит от площади, геометрии, состояния основания, интеграций и условий объекта. Его можно обсуждать после знакомства с задачей." }
];

export default function HomePage() {
  return (
    <main id="main-content">
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow"><span className="eyebrowLine" />Натяжные стены · архитектурный текстиль</p>
            <h1 id="hero-heading">Натяжные стены для интерьеров, в которых всё продумано</h1>
            <p className={styles.heroLead}>Архитектурный текстиль для квартир, домов и коммерческих пространств. Полотно формирует ровную декоративную поверхность без штукатурного финиша на самой стене.</p>
            <div className={styles.heroActions}>
              <Link className="button buttonDark" href="/cost">Рассчитать проект <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link className={styles.quietLink} href="/technology">Как устроена система <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className={styles.heroFoot}><span>01 / 13</span><span className={styles.heroFootHighlight}>Для жилых и коммерческих пространств</span></div>
          </div>
          <div className={styles.heroMedia}>
            <PlaceholderMedia slot="homeHero" priority label="PHOTO PLACEHOLDER / фото интерьера ожидается" />
            <span className={styles.mediaIndex}>OV — 01</span>
          </div>
        </div>
        <a className={`container ${styles.scrollCue}`} href="#home-values"><span>Исследовать решение</span><ArrowDown size={15} aria-hidden="true" /></a>
      </section>

      <section className={styles.valuesSection} id="home-values" aria-label="Ключевые свойства решения">
        <div className={`container ${styles.valuesGrid}`}>
          <div className={styles.valueTag}><Clock3 size={36} strokeWidth={1.5} aria-hidden="true" /><span>Быстро</span></div>
          <div className={styles.valueTag}><Sofa size={36} strokeWidth={1.5} aria-hidden="true" /><span>Уютно</span></div>
          <div className={styles.valueTag}><ThermometerSun size={36} strokeWidth={1.5} aria-hidden="true" /><span>Тепло</span></div>
          <div className={styles.valueTag}><VolumeX size={36} strokeWidth={1.5} aria-hidden="true" /><span>Тихо</span></div>
        </div>
      </section>

      <section className={`section ${styles.audienceSection}`} aria-labelledby="audience-title">
        <div className="container">
          <div className="sectionTop">
            <div><p className="eyebrow"><span className="eyebrowLine" />Два направления</p><h2 id="audience-title" className="sectionHeading">Решение для вашего пространства</h2></div>
            <p className="sectionLead">Разные задачи требуют разного подхода. Начните с того, что важно именно вашему объекту.</p>
          </div>
          <div className={styles.audienceGrid}>
            <Link className={styles.audienceCard} href="/home">
              <PlaceholderMedia slot="homeAudienceHome" label="PHOTO PLACEHOLDER / жилой интерьер ожидается" />
              <div className={styles.audienceCardText}><div><span>01 / ЧАСТНЫЙ ИНТЕРЬЕР</span><h3>Для дома</h3></div><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></div>
              <p>Фактура, освещение и детали повседневного использования — в едином решении.</p>
            </Link>
            <Link className={styles.audienceCard} href="/business">
              <PlaceholderMedia slot="homeAudienceBusiness" label="PHOTO PLACEHOLDER / коммерческий интерьер ожидается" />
              <div className={styles.audienceCardText}><div><span>02 / КОММЕРЧЕСКОЕ ПРОСТРАНСТВО</span><h3>Для бизнеса</h3></div><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></div>
              <p>Обсудим требования объекта, технические узлы и организацию работ.</p>
            </Link>
          </div>
        </div>
      </section>

      {!isPublicMode ? <section className={`section ${styles.projectSection}`} aria-labelledby="project-title">
        <div className="container">
          <div className="sectionTop">
            <div><p className="eyebrow"><span className="eyebrowLine" />Визуальный результат</p><h2 id="project-title" className="sectionHeading">Сначала вы видите пространство. Потом замечаете детали.</h2></div>
            <p className="sectionLead">Концептуальные визуализации помогают увидеть фактуру и пропорции. Фотографии реализованных объектов добавим после согласования и проверки прав.</p>
          </div>
          <div className={styles.projectMedia}><PlaceholderMedia slot="homeProjectFeature" label="ВИЗУАЛИЗАЦИЯ / концепт интерьера" /><div className={styles.projectMediaLabel}><span>ВИЗУАЛИЗАЦИЯ</span><b>Концепт интерьера · не объект из портфолио</b></div></div>
        </div>
      </section> : null}

      <section className={`section ${styles.productSection}`} aria-labelledby="product-title">
        <div className={`container ${styles.productGrid}`}>
          <div className={styles.productMedia}><PlaceholderMedia slot="homeProductTexture" label="ВИЗУАЛИЗАЦИЯ / фактура материала" /></div>
          <div className={styles.productCopy}>
            <p className="eyebrow"><span className="eyebrowLine" />Принцип системы</p>
            <h2 id="product-title" className="sectionHeading">Что такое натяжные стены</h2>
            <p>Архитектурный текстиль фиксируется в профильной конструкции и формирует ровную декоративную поверхность. Решение проектируется под геометрию помещения, материал и необходимые узлы.</p>
            <Link className="textLink" href="/stretch-walls">Подробнее о натяжных стенах <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {!isPublicMode ? <section className={`section ${styles.workSection}`} aria-labelledby="work-title">
        <div className="container">
          <div className="sectionTop">
            <div><p className="eyebrow"><span className="eyebrowLine" />Визуальные примеры</p><h2 id="work-title" className="sectionHeading">Примеры наших работ</h2></div>
            <p className="sectionLead">Названия и детали взяты из фотографий объектов. Здесь показаны новые концептуальные рендеры по этим фотографиям, а не снимки выполненных интерьеров.</p>
          </div>
          <div className={styles.workGrid}>
            {workExamples.map((example, index) => <article className={styles.workCard} key={example.slug}>
              <PlaceholderMedia slot={example.slot} />
              <div className={styles.workCardCopy}><span>{String(index + 1).padStart(2, "0")} / ВИЗУАЛИЗАЦИЯ ПО ФОТО ОБЪЕКТА</span><h3>{example.title}</h3></div>
            </article>)}
          </div>
          <div className={styles.workFooter}><p>Визуализации сохраняют общую идею исходных объектов; вид фактур и оттенки на экране могут отличаться от оригинала.</p><Link className="textLink" href="/projects">Смотреть проекты <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section> : null}

      <section className={`section ${styles.benefitsSection}`} aria-labelledby="benefits-title">
        <div className="container">
          <div className={styles.benefitsIntro}><p className="eyebrow"><span className="eyebrowLine" />Четыре аспекта</p><h2 id="benefits-title" className="sectionHeading">Продумано не только для фотографии</h2></div>
          <div className={styles.benefitsGrid}>
            <article><span>01</span><Sparkles size={20} strokeWidth={1.5} aria-hidden="true" /><h3>Внешний вид</h3><p>Текстильная фактура и матовая поверхность помогают создать цельный интерьер.</p></article>
            <article><span>02</span><Layers3 size={20} strokeWidth={1.5} aria-hidden="true" /><h3>Сухой финишный монтаж</h3><p>Для установки полотна не требуется наносить на него штукатурные и шпаклёвочные слои.</p></article>
            <article><span>03</span><Ruler size={20} strokeWidth={1.5} aria-hidden="true" /><h3>Интеграция деталей</h3><p>Розетки, примыкания и свет можно заранее учесть в проекте.</p></article>
            <article><span>04</span><span className={styles.soundMark} aria-hidden="true">∿</span><h3>Опции акустики</h3><p>Акустическое наполнение рассматривают отдельно, под задачу конкретного помещения.</p></article>
          </div>
        </div>
      </section>

      <section className={`section ${styles.technologySection}`} aria-labelledby="technology-title">
        <div className={`container ${styles.technologyGrid}`}>
          <div className={styles.diagramWrap}>
            <div className={styles.diagramCaption}><span>КОНЦЕПТУАЛЬНЫЙ РАЗРЕЗ</span><span>БЕЗ РАЗМЕРОВ · НЕ РАБОЧИЙ ЧЕРТЁЖ</span></div>
            <PlaceholderMedia slot="technologyCutaway" showCaption={false} />
            <p className={styles.diagramFoot}>Показан общий принцип. Точная конструкция определяется документацией конкретной системы.</p>
          </div>
          <div className={styles.technologyCopy}>
            <p className="eyebrow"><span className="eyebrowLine" />Устройство стены</p>
            <h2 id="technology-title" className="sectionHeading">Что находится за текстилем</h2>
            <p>Профиль задаёт контур поверхности, полотно формирует видимую фактуру. Дополнительные слои возможны после согласования конфигурации.</p>
            <p className={styles.acousticNote}>Звукопоглощение внутри помещения и звукоизоляция между комнатами — разные задачи.</p>
            <Link className="textLink" href="/technology">Изучить технологию <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className={`section ${styles.materialSection}`} aria-labelledby="material-title">
        <div className="container">
          <div className="sectionTop">
            <div><p className="eyebrow"><span className="eyebrowLine" />Материал и свет</p><h2 id="material-title" className="sectionHeading">Фактура меняет восприятие пространства</h2></div>
            <div className="sectionTopActions"><Link className="textLink" href="/materials">Как выбирать материалы <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </div>
          <div className={styles.materialGrid}>
            <PlaceholderMedia slot="homeMaterialSampleOne" label="ВИЗУАЛИЗАЦИЯ / фактура материала" />
            <div className={styles.materialText}><span>01 / ВЫБОР МАТЕРИАЛА</span><p>Один оттенок по-разному выглядит при дневном и искусственном свете. Материал стоит оценивать вместе с задачей интерьера и условиями эксплуатации.</p><Link className="textLink" href="/contacts">Обсудить подбор <ArrowRight size={15} aria-hidden="true" /></Link></div>
            <PlaceholderMedia slot="homeMaterialSampleTwo" label="ВИЗУАЛИЗАЦИЯ / фактура материала" />
          </div>
        </div>
      </section>

      <section className={`section ${styles.processSection}`} aria-labelledby="process-title">
        <div className="container">
          <div className={styles.processHeading}><p className="eyebrow"><span className="eyebrowLine" />Порядок работы</p><h2 id="process-title" className="sectionHeading">От идеи до готовой стены</h2></div>
          <ol className={styles.processList}>
            <li><span>01</span><div><h3>Обсуждаем задачу</h3><p>Помещение, стиль, ограничения и ожидания от результата.</p></div><ArrowRight size={16} aria-hidden="true" /></li>
            <li><span>02</span><div><h3>Подбираем решение</h3><p>Материал, конструкция и детали интеграции.</p></div><ArrowRight size={16} aria-hidden="true" /></li>
            <li><span>03</span><div><h3>Согласуем расчёт</h3><p>Объём работ и условия выполнения по параметрам объекта.</p></div><ArrowRight size={16} aria-hidden="true" /></li>
            <li><span>04</span><div><h3>Реализуем проект</h3><p>Монтаж и проверка результата по согласованному решению.</p></div><ArrowRight size={16} aria-hidden="true" /></li>
          </ol>
        </div>
      </section>

      <section className={`section ${styles.costSection}`} aria-labelledby="cost-title">
        <div className={`container ${styles.costGrid}`}>
          <div><p className="eyebrow"><span className="eyebrowLine" />Расчёт</p><h2 id="cost-title" className="sectionHeading">Стоимость начинается с параметров проекта</h2></div>
          <div><p>Стоимость зависит от площади и геометрии стен, выбранного материала, узлов и условий монтажа. Предварительную оценку начинаем с параметров проекта.</p><Link className="button buttonDark" href="/cost">Перейти к форме запроса <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className={`section ${styles.designersSection}`} aria-labelledby="designers-title">
        <div className={`container ${styles.designersGrid}`}>
          <div className={styles.designersMedia}><PlaceholderMedia slot="homeDesignerDetails" label="ВИЗУАЛИЗАЦИЯ / подбор материалов" /></div>
          <div><p className="eyebrow"><span className="eyebrowLine" />Профессиональный маршрут</p><h2 id="designers-title" className="sectionHeading">Для тех, кто проектирует интерьер</h2><p className="sectionLead">Обсудим материалы, чертежи узлов, сопряжения с другими поверхностями и технологические ограничения до реализации.</p><Link className="textLink" href="/designers">Дизайнерам и архитекторам <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className={`section ${styles.faqSection}`} aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div><p className="eyebrow"><span className="eyebrowLine" />Короткие ответы</p><h2 id="faq-title" className="sectionHeading">Частые вопросы</h2><p className="sectionLead">Для конкретного решения важны конструкция и выбранный материал.</p></div>
          <div className={styles.faqList}>
            {questions.map((item) => <details className={styles.faqItem} key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className={`section sectionDark ${styles.finalSection}`} aria-labelledby="final-title">
        <div className={`container ${styles.finalGrid}`}>
          <div><p className="eyebrow"><span className="eyebrowLine" />Следующий шаг</p><h2 id="final-title" className="sectionHeading">Расскажите о своём проекте</h2></div>
          <div><p className="sectionLead">Квартира, загородный дом или коммерческий объект — начнём с задачи и определим, какие данные нужны для расчёта.</p><Link className={styles.finalButton} href="/cost">Рассчитать проект <ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="textLink" href="/contacts">Контакты <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </main>
  );
}
