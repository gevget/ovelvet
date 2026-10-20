import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { metadataFor } from "@/lib/site";
import { siteSettings } from "@/content/site-settings";
import styles from "./page.module.css";

export const metadata: Metadata = { ...metadataFor("/contacts/"), robots: { index: false, follow: false } };

export default function ContactsPage() {
  return (
    <main id="main-content" className={`container ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow"><span className="eyebrowLine" />Контакты</p>
        <h1>Обсудим ваш проект</h1>
        <p>Позвоните или напишите, чтобы обсудить задачу и понять, какие данные подготовить. Форма на сайте пока доступна только для предпросмотра.</p>
      </header>
      <div className={styles.columns}>
        <aside className={styles.note}>
          <span>КАНАЛЫ СВЯЗИ</span>
          <div className={styles.realContacts}>
            <a href={`tel:${siteSettings.phone.replace(/[^+\d]/g, "")}`}>{siteSettings.phone}</a>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          </div>
          <div className={styles.addressBlock}>
            <span>АДРЕС</span>
            <p>{siteSettings.address}</p>
          </div>
          <div className={styles.status}>Форма доступна для проверки интерфейса. Запрос не передаётся владельцу и не сохраняется.</div>
        </aside>
        <section className={styles.formWrap} aria-labelledby="contact-form-title">
          <p className="eyebrow"><span className="eyebrowLine" />Демо-форма</p>
          <h2 id="contact-form-title">Оставить тестовый запрос</h2>
          <p className={styles.formLead}>Используйте вымышленные данные для проверки формы. Отправки владельцу пока нет.</p>
          <LeadForm source="contact" />
        </section>
      </div>
    </main>
  );
}
