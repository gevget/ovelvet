"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { parseWallArea } from "@/lib/calculator";
import { FormField, TextareaField } from "@/components/form-field";
import styles from "./estimate-wizard.module.css";

type Audience = "home" | "business" | "both";
type FieldErrors = Record<string, string>;

export function EstimateWizard({ initialAudience }: { initialAudience: Audience }) {
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [area, setArea] = useState("");
  const [areaUnknown, setAreaUnknown] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [materialPreference, setMaterialPreference] = useState("");
  const [acousticInterest, setAcousticInterest] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [planLink, setPlanLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formKey, setFormKey] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) headingRef.current?.focus();
    previousStep.current = step;
  }, [step]);

  function nextStep() {
    const nextErrors: FieldErrors = {};
    if (!audience || audience === "both") nextErrors.audience = "Выберите сценарий проекта.";
    if (!projectType) nextErrors.projectType = "Выберите тип помещения.";
    const normalizedArea = areaUnknown || !area.trim() ? null : parseWallArea(area);
    if (normalizedArea !== null && Number.isNaN(normalizedArea)) nextErrors.area = "Введите положительную площадь до 100 000 м².";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(2);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 3) {
      if (step === 1) nextStep();
      else if (step === 2) {
        if (area.trim() && areaValue !== null && Number.isNaN(areaValue)) setErrors({ area: "Введите положительную площадь до 100 000 м²." });
        else setStep(3);
      }
      return;
    }
    setErrors({});
    setMessage("");
    const form = new FormData(event.currentTarget);
    const text = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" && value !== "" ? value : undefined;
    };
    if (form.get("demoConsent") !== "on") {
      setErrors({ consent: "Подтвердите, что используете тестовые данные." });
      return;
    }
    const normalizedArea = areaUnknown || !area.trim() ? null : parseWallArea(area);
    const payload = {
      source: "cost",
      audience,
      projectType: projectType || undefined,
      wallAreaM2: normalizedArea ?? undefined,
      areaUnknown,
      materialPreference: materialPreference || undefined,
      acousticInterest,
      name: text("name"),
      phone: text("phone"),
      email: text("email"),
      comment: text("comment"),
      planLink: text("planLink"),
      consentVersion: "preview-v1",
      consentGranted: true,
      website: text("website") ?? ""
    };
    if (process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true") {
      setMessage("Предварительная версия: запрос не отправлен и не сохранён.");
      return;
    }
    setBusy(true);
    void fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(async (response) => {
        const result = await response.json() as { message?: string; fields?: Record<string, string> };
        if (response.status === 503) { setMessage(result.message ?? "Демо: запрос не отправлен."); return; }
        if (!response.ok) { setErrors(result.fields ?? { form: result.message ?? "Проверьте заполненные поля." }); return; }
        setMessage("Запрос принят.");
        setStep(1);
        setArea(""); setAreaUnknown(false); setProjectType(""); setMaterialPreference(""); setAcousticInterest(false); setName(""); setPhone(""); setEmail(""); setComment(""); setPlanLink("");
        setFormKey((value) => value + 1);
      })
      .catch(() => setErrors({ form: "Не удалось проверить запрос. Проверьте соединение и попробуйте ещё раз." }))
      .finally(() => setBusy(false));
  }

  const areaValue = areaUnknown || !area.trim() ? null : parseWallArea(area);
  const types = audience === "business"
    ? [["office", "Офис"], ["hotel", "Отель"], ["restaurant", "Ресторан"], ["other", "Другое"]]
    : [["flat", "Квартира"], ["house", "Дом"], ["other", "Другое"]];

  return (
    <div className={styles.wizard}>
      <div className={styles.progress} role="progressbar" aria-label={`Шаг ${step} из 3`} aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-live="polite">
        {[1, 2, 3].map((number) => <span key={number} className={number <= step ? styles.progressActive : ""} />)}
      </div>
      <div className={styles.stepHeading}><span>ШАГ 0{step} / 03</span><h2 ref={headingRef} tabIndex={-1}>{step === 1 ? "Для какого объекта?" : step === 2 ? "Какие параметры известны?" : "Куда ответить?"}</h2></div>
      <form onSubmit={submit} key={formKey} noValidate>
        {step === 1 ? <div className={styles.stepContent}>
          <fieldset className={styles.audienceFieldset}><legend>Тип проекта</legend><div className={styles.audienceOptions}>
            <button type="button" aria-pressed={audience === "home"} className={audience === "home" ? styles.choiceActive : ""} onClick={() => { setAudience("home"); setProjectType(""); setErrors({}); }}>Для дома</button>
            <button type="button" aria-pressed={audience === "business"} className={audience === "business" ? styles.choiceActive : ""} onClick={() => { setAudience("business"); setProjectType(""); setErrors({}); }}>Для бизнеса</button>
          </div>{errors.audience ? <span className={styles.error}>{errors.audience}</span> : null}</fieldset>
          <fieldset className={styles.audienceFieldset}><legend>Тип помещения</legend><div className={styles.typeOptions}>{types.map(([value, label]) => <button type="button" key={value} aria-pressed={projectType === value} className={projectType === value ? styles.choiceActive : ""} onClick={() => { setProjectType(value); setErrors((current) => ({ ...current, projectType: "" })); }}>{label}</button>)}</div>{errors.projectType ? <span className={styles.error}>{errors.projectType}</span> : null}</fieldset>
          <button type="button" className="button buttonDark" onClick={nextStep}>Продолжить <ArrowRight size={16} aria-hidden="true" /></button>
        </div> : null}

        {step === 2 ? <div className={styles.stepContent}>
          <FormField label="Ориентировочная площадь стен, м²" name="wallAreaM2" type="text" inputMode="decimal" value={area} onChange={(event) => setArea(event.target.value)} placeholder="Например, 24,5" hint="Можно оставить пустым или выбрать «Площадь пока неизвестна»." error={errors.area} />
          <label className={styles.checkRow}><input type="checkbox" checked={areaUnknown} onChange={(event) => { setAreaUnknown(event.target.checked); if (event.target.checked) setErrors((current) => ({ ...current, area: "" })); }} /><span>Площадь пока неизвестна</span></label>
          <div className={styles.optionFields}>
            <FormField label="Материал или фактура" name="materialPreference" value={materialPreference} onChange={(event) => setMaterialPreference(event.target.value)} placeholder="Нужна консультация" />
            <label className={styles.checkRow}><input type="checkbox" checked={acousticInterest} onChange={(event) => setAcousticInterest(event.target.checked)} /><span>Хочу обсудить акустическое наполнение</span></label>
          </div>
          <div className={styles.actions}><button type="button" className={styles.backButton} onClick={() => setStep(1)}><ArrowLeft size={15} aria-hidden="true" /> Назад</button><button type="button" className="button buttonDark" onClick={() => { if (area.trim() && areaValue !== null && Number.isNaN(areaValue)) { setErrors({ area: "Введите положительную площадь до 100 000 м²." }); return; } setStep(3); }}>Продолжить <ArrowRight size={16} aria-hidden="true" /></button></div>
        </div> : null}

        {step === 3 ? <div className={styles.stepContent}>
          <div className={styles.summary}><span>РЕЗЮМЕ ЗАПРОСА</span><p><b>{audience === "home" ? "Для дома" : "Для бизнеса"}</b> · {projectTypeLabel(projectType)} · {areaUnknown || !area.trim() ? "площадь уточняется" : Number.isNaN(areaValue) ? "площадь не указана" : `${areaValue} м²`}</p>{materialPreference ? <p>Материал: {materialPreference}</p> : null}{acousticInterest ? <p>Интерес: акустическое наполнение, параметры уточняются</p> : null}</div>
          <div className={styles.contactFields}><FormField label="Имя" name="name" autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться?" /><FormField label="Телефон" name="phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 ___ ___-__-__" error={errors.phone} /><FormField label="Электронная почта" name="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.ru" error={errors.email} /><TextareaField label="Комментарий" name="comment" maxLength={2000} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Что важно учесть?" /><FormField label="Ссылка на план или ТЗ" name="planLink" type="url" maxLength={2000} value={planLink} onChange={(event) => setPlanLink(event.target.value)} placeholder="Необязательно · загрузка файлов отключена" /></div>
          <input className={styles.honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className={styles.demoConsent}><input type="checkbox" name="demoConsent" /><span className={styles.check}><Check size={12} aria-hidden="true" /></span><span>Тестовые данные нужны только для проверки формы. Запрос не передаётся владельцу и не сохраняется. <Link href="/privacy">О политике данных</Link></span></label>
          {errors.consent ? <p className={styles.error}>{errors.consent}</p> : null}
          {errors.contact ? <p className={styles.error}>{errors.contact}</p> : null}
          {errors.form ? <p className={styles.error}>{errors.form}</p> : null}
          <div className={styles.actions}><button type="button" className={styles.backButton} onClick={() => setStep(2)}><ArrowLeft size={15} aria-hidden="true" /> Назад</button><button type="submit" className="button buttonDark" disabled={busy}>{busy ? "Проверяем…" : "Проверить запрос"}<ArrowUpRight size={16} aria-hidden="true" /></button></div>
        </div> : null}
      </form>
      <p className={styles.formMessage} aria-live="polite">{message}</p>
      <p className={styles.demoNotice}>Предпросмотр формы · доставка отключена. Стоимость не рассчитывается автоматически.</p>
    </div>
  );
}

function projectTypeLabel(value: string) {
  const labels: Record<string, string> = { flat: "квартира", house: "дом", office: "офис", hotel: "отель", restaurant: "ресторан", other: "другое помещение" };
  return labels[value] ?? "тип помещения не выбран";
}
