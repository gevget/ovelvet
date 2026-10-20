"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { FormField, TextareaField } from "@/components/form-field";
import styles from "./lead-form.module.css";

type Source = "contact" | "designer";

export function LeadForm({ source, audience = "both" }: { source: Source; audience?: "home" | "business" | "both" }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const projectOptions = audience === "home"
    ? [["flat", "Квартира"], ["house", "Дом"], ["other", "Другое"]]
    : audience === "business"
      ? [["office", "Офис"], ["hotel", "Отель"], ["restaurant", "Ресторан"], ["other", "Другое"]]
      : [["flat", "Квартира"], ["house", "Дом"], ["office", "Офис"], ["hotel", "Отель"], ["restaurant", "Ресторан"], ["other", "Другое"]];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get("demoConsent") !== "on") {
      setError("Подтвердите, что вводите тестовые данные для предпросмотра.");
      return;
    }
    const text = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" && value !== "" ? value : undefined;
    };
    const phone = text("phone");
    const email = text("email");
    const nextFieldErrors: Record<string, string> = {};
    if (!phone && !email) nextFieldErrors.contact = "Укажите телефон или электронную почту.";
    if (phone && !/^\+?[\d\s().-]{7,24}$/.test(phone)) nextFieldErrors.phone = "Проверьте формат телефона.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextFieldErrors.email = "Проверьте адрес электронной почты.";
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      setError(nextFieldErrors.contact ?? nextFieldErrors.phone ?? nextFieldErrors.email ?? "Проверьте заполненные поля.");
      return;
    }
    setFieldErrors({});
    const payload = {
      source,
      audience,
      projectType: text("projectType"),
      name: text("name"),
      phone: text("phone"),
      email: text("email"),
      comment: text("comment"),
      planLink: text("planLink"),
      consentVersion: "preview-v1",
      consentGranted: form.get("demoConsent") === "on",
      website: text("website") ?? ""
    };
    setBusy(true);
    try {
      const response = await fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { message?: string; fields?: Record<string, string> };
      if (response.status === 503) {
        setMessage(result.message ?? "Демо: запрос не отправлен.");
        return;
      }
      if (!response.ok) {
        setFieldErrors(result.fields ?? {});
        setError(result.fields?.contact ?? result.fields?.phone ?? result.fields?.email ?? result.fields?.planLink ?? result.message ?? "Проверьте заполненные поля.");
        return;
      }
      setMessage("Запрос принят.");
      formElement.reset();
    } catch {
      setError("Не удалось проверить запрос. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        <FormField label="Имя" name="name" autoComplete="name" maxLength={100} placeholder="Как к вам обращаться?" />
        <FormField label="Телефон" name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+7 ___ ___-__-__" error={fieldErrors.phone} />
        <FormField label="Электронная почта" name="email" type="email" autoComplete="email" maxLength={254} placeholder="name@example.ru" error={fieldErrors.email} />
        <label className={styles.selectField} htmlFor="projectType">Тип помещения
          <select id="projectType" name="projectType" defaultValue="">
            <option value="">Выберите, если знаете</option>
            {projectOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <TextareaField wrapperClassName={styles.full} label="Что важно учесть" name="comment" maxLength={2000} placeholder="Коротко опишите помещение и задачу" />
        <FormField wrapperClassName={styles.full} label="Ссылка на план или ТЗ" name="planLink" type="url" maxLength={2000} placeholder="Необязательно · загрузка файлов пока отключена" error={fieldErrors.planLink} />
      </div>
      <input className={styles.honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className={styles.demoConsent}>
        <input type="checkbox" name="demoConsent" required />
        <span className={styles.check}><Check size={13} aria-hidden="true" /></span>
        <span>Тестовые данные нужны только для проверки формы. Запрос не передаётся владельцу и не сохраняется. <Link href="/privacy">О политике данных</Link></span>
      </label>
      <div className={styles.submitRow}>
        <button className="button buttonDark" type="submit" disabled={busy}>{busy ? "Проверяем…" : "Проверить форму"}<ArrowUpRight size={17} aria-hidden="true" /></button>
        <p>Демо-режим · заявка не будет доставлена</p>
      </div>
      <p className={styles.status} aria-live="polite" role={error ? "alert" : "status"}>{error || message}</p>
    </form>
  );
}
