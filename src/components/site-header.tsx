"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, footerNavigation } from "@/lib/site";
import { BrandSymbol } from "./brand-symbol";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDetailsElement>(null);
  const moreNavigation = footerNavigation.slice(navigation.length);

  const updateMobileMenuPosition = useCallback(() => {
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom;
    if (headerBottom !== undefined) {
      panelRef.current?.style.setProperty("--mobile-menu-top", `${Math.ceil(headerBottom)}px`);
    }
  }, []);

  const toggleMobileMenu = () => {
    if (!open) updateMobileMenuPosition();
    setOpen(!open);
  };

  useEffect(() => {
    const closeMoreMenuOnOutsideClick = (event: MouseEvent) => {
      const menu = moreMenuRef.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    };
    document.addEventListener("click", closeMoreMenuOnOutsideClick);
    return () => document.removeEventListener("click", closeMoreMenuOnOutsideClick);
  }, []);

  useEffect(() => {
    if (moreMenuRef.current) moreMenuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    updateMobileMenuPosition();
    window.addEventListener("resize", updateMobileMenuPosition);
    return () => window.removeEventListener("resize", updateMobileMenuPosition);
  }, [open, updateMobileMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a[tabindex='0']")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key === "Tab" && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href][tabindex='0']"));
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link className={styles.logo} href="/" aria-label="OTAGAN VELVET — на главную" onClick={() => setOpen(false)}>
            <BrandSymbol className={styles.logoMark} />
            <span className={styles.logoText}>OTAGAN <b>VELVET</b></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Основная навигация">
            {navigation.map((item) => (
              <Link className={styles.navLink} href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <details className={styles.moreMenu} ref={moreMenuRef}>
              <summary>Ещё</summary>
              <div className={styles.morePanel}>{moreNavigation.map((item) => <Link href={item.href} key={item.href} onClick={() => { if (moreMenuRef.current) moreMenuRef.current.open = false; }}>{item.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>)}</div>
            </details>
          </nav>
          <Link className={styles.headerCta} href="/cost">
            Рассчитать проект <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={toggleMobileMenu}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            <span>{open ? "Закрыть" : "Меню"}</span>
          </button>
        </div>
      </header>
      <div ref={panelRef} className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`} id="mobile-navigation" aria-hidden={!open}>
        <nav className={styles.mobileNav} aria-label="Навигация по сайту">
          {footerNavigation.map((item, index) => (
            <Link
              className={`${styles.mobileLink} ${index === 1 || index === 2 ? styles.audienceLink : ""}`}
              href={item.href}
              key={`${item.href}-${index}`}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {item.label}<ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ))}
          <Link className={styles.mobileCta} href="/cost" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            Рассчитать проект <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </>
  );
}
