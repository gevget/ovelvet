import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNavigation, isPublicMode } from "@/lib/site";
import { siteSettings } from "@/content/site-settings";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brandBlock}>
          <Link href="/" className={styles.brand}>OTAGAN <span>VELVET</span></Link>
          <p>Натяжные стены<br />из архитектурного текстиля</p>
        </div>
        <div className={styles.footerNav} aria-label="Ссылки в подвале">
          {footerNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>
          ))}
        </div>
        <div className={styles.contactNote}>
          <span className="eyebrow">КОНТАКТЫ</span>
          {siteSettings.phone || siteSettings.email ? <div className={styles.contactLinks}>{siteSettings.phone ? <a href={`tel:${siteSettings.phone.replace(/[^+\d]/g, "")}`}>{siteSettings.phone}</a> : null}{siteSettings.email ? <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a> : null}</div> : <p>Контактные данные будут добавлены после подтверждения.</p>}
          {siteSettings.address ? <p className={styles.address}>{siteSettings.address}</p> : null}
          <Link href="/contacts">Открыть контакты <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© OTAGAN VELVET</span>
        <span>{isPublicMode ? siteSettings.legalName : "Локальный предпросмотр · концепты не являются подтверждёнными кейсами"}</span>
        <Link href="/privacy">Политика данных</Link>
      </div>
    </footer>
  );
}
