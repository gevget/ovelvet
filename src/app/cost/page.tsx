import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EstimateWizard } from "@/components/estimate-wizard";
import { CostSavingsCalculator } from "@/components/cost-savings-calculator";
import { isPublicMode, metadataFor } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = metadataFor("/cost/");
type SearchParams = Promise<{ type?: string | string[] }>;

export default async function CostPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selection = Array.isArray(params.type) ? params.type[0] : params.type;
  const initialAudience = selection === "home" || selection === "business" ? selection : "both";
  return (
    <main id="main-content" className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <div><p className="eyebrow"><span className="eyebrowLine" />Расчёт проекта</p><h1>Стоимость начинается с параметров объекта</h1><p className={styles.lead}>Ниже — пример сравнения для разной площади. Указанные ставки не являются прайсом OTAGAN VELVET; их нужно подтвердить до использования.</p><Link href="/technology" className={styles.quietLink}>Как устроена система <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <aside className={styles.factors} aria-label="Факторы расчёта"><span>ЧТО УЧИТЫВАЕТСЯ</span><ol><li>Площадь и геометрия</li><li>Материал и фактура</li><li>Примыкания и интеграции</li><li>Условия объекта</li></ol><p>Итог обсуждается после знакомства с задачей и уточнения технических деталей.</p></aside>
      </section>
      {!isPublicMode ? <section className={`container ${styles.comparisonSection}`} aria-labelledby="savings-heading">
        <div className={styles.comparisonIntro}>
          <p className="eyebrow"><span className="eyebrowLine" />Интерактивное сравнение</p>
          <h2 id="savings-heading">Посмотрите расчёт для своей площади</h2>
          <p>Передвиньте ползунок, чтобы увидеть, как меняются суммы в примере.</p>
        </div>
        <CostSavingsCalculator />
      </section> : null}
      <section className={`container ${styles.formSection}`} aria-labelledby="request-heading"><div className={styles.formIntro}><p className="eyebrow"><span className="eyebrowLine" />Заявка на предварительную оценку</p><h2 id="request-heading">Расскажите о проекте</h2><p>Площадь можно не знать. Подготовка плана или технического задания необязательна.</p></div><EstimateWizard initialAudience={initialAudience} /></section>
    </main>
  );
}
