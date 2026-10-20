import type { Metadata } from "next";
import { metadataFor } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = { ...metadataFor("/privacy/"), robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <p className="eyebrow"><span className="eyebrowLine" />Юридическая информация</p><h1>Политика обработки персональных данных</h1>
      <section className={styles.notice} aria-labelledby="privacy-status"><span>СТАТУС / НЕ СОГЛАСОВАНА</span><h2 id="privacy-status">Документ готовится к заполнению</h2><p>Оператор данных, реквизиты, цели, основания и сроки обработки должны быть подтверждены владельцем сайта и согласованы до публикации.</p><p>Формы в локальном предпросмотре не сохраняют и не передают введённые данные. Для проверки используйте только тестовые значения.</p></section>
    </main>
  );
}
