import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <span className={styles.code}>404 / СТРАНИЦА НЕ НАЙДЕНА</span><h1>Похоже, адрес изменился</h1><p>Проверьте ссылку или вернитесь к разделам сайта.</p><div><Link className="button buttonDark" href="/"><ArrowLeft size={16} aria-hidden="true" />На главную</Link><Link className={styles.link} href="/cost">К расчёту проекта <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    </main>
  );
}
