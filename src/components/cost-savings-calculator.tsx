"use client";

import { useState, type CSSProperties } from "react";
import styles from "./cost-savings-calculator.module.css";

// TODO: VERIFY: per-m² rates transcribed from the owner's reference screenshot; confirm scope and current prices before public use.
const rates = {
  textile: { materials: 2850, work: 1300 },
  traditional: { materials: 2016, work: 3184 }
} as const;

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export function CostSavingsCalculator() {
  const [area, setArea] = useState(1);
  const progress = ((area - 1) / 99) * 100;
  const textileMaterials = rates.textile.materials * area;
  const textileWork = rates.textile.work * area;
  const traditionalMaterials = rates.traditional.materials * area;
  const traditionalWork = rates.traditional.work * area;
  const textileTotal = textileMaterials + textileWork;
  const traditionalTotal = traditionalMaterials + traditionalWork;
  const difference = traditionalTotal - textileTotal;

  return <div className={styles.calculator}>
    <div className={styles.demoLabel}>ДЕМО · СТАВКИ ИЗ ПРИМЕРА · TODO: VERIFY</div>
    <div className={styles.areaControl}>
      <div className={styles.areaHeading}>
        <label htmlFor="comparison-area">Площадь поверхности</label>
        <output htmlFor="comparison-area" aria-live="polite">{rubles.format(area)} м²</output>
      </div>
      <input
        id="comparison-area"
        className={styles.slider}
        type="range"
        min="1"
        max="100"
        step="1"
        value={area}
        aria-valuetext={`${area} м²`}
        onChange={(event) => setArea(Number(event.currentTarget.value))}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
      />
      <div className={styles.rangeLabels} aria-hidden="true"><span>1 м²</span><span>100 м²</span></div>
    </div>

    <div className={styles.comparisonGrid}>
      <article className={`${styles.optionCard} ${styles.textileCard}`}>
        <div className={styles.cardHeading}><span>01 / СРАВНЕНИЕ</span><h3>Архитектурный текстиль</h3></div>
        <dl className={styles.costRows}>
          <div><dt>Материалы</dt><dd>{rubles.format(textileMaterials)} <span>₽</span></dd></div>
          <div><dt>Работа</dt><dd>{rubles.format(textileWork)} <span>₽</span></dd></div>
        </dl>
        <div className={styles.total}><span>Итого</span><strong>{rubles.format(textileTotal)} <span>₽</span></strong></div>
        <p className={styles.cardNote}>Промежуточная сумма по ставкам из примера.</p>
      </article>

      <article className={styles.optionCard}>
        <div className={styles.cardHeading}><span>02 / СРАВНЕНИЕ</span><h3>Обычная отделка</h3></div>
        <dl className={styles.costRows}>
          <div><dt>Материалы</dt><dd>{rubles.format(traditionalMaterials)} <span>₽</span></dd></div>
          <div><dt>Работа</dt><dd>{rubles.format(traditionalWork)} <span>₽</span></dd></div>
        </dl>
        <div className={styles.total}><span>Итого</span><strong>{rubles.format(traditionalTotal)} <span>₽</span></strong></div>
        <p className={styles.cardNote}>Состав сравнения и ставки нуждаются в проверке.</p>
      </article>
    </div>

    <div className={styles.difference}>
      <span>Разница по ставкам из примера</span>
      <strong>{rubles.format(difference)} <span>₽</span></strong>
    </div>
    <p className={styles.disclaimer}>Локальный демонстрационный расчёт. Это не цена OTAGAN VELVET и не смета: ставки и состав сравнения нужно подтвердить до использования.</p>
  </div>;
}
