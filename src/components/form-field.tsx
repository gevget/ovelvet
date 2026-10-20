import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./form-field.module.css";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; wrapperClassName?: string };
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string; wrapperClassName?: string };

export function FormField({ label, hint, error, id, wrapperClassName = "", ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={`${styles.field} ${wrapperClassName}`}>
      <label htmlFor={fieldId}>{label}</label>
      {hint ? <span className={styles.hint} id={hintId}>{hint}</span> : null}
      <input {...props} id={fieldId} aria-invalid={Boolean(error)} aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined} />
      {error ? <span className={styles.error} id={errorId}>{error}</span> : null}
    </div>
  );
}

export function TextareaField({ label, hint, error, id, wrapperClassName = "", ...props }: TextareaProps) {
  const fieldId = id ?? props.name;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={`${styles.field} ${wrapperClassName}`}>
      <label htmlFor={fieldId}>{label}</label>
      {hint ? <span className={styles.hint} id={hintId}>{hint}</span> : null}
      <textarea {...props} id={fieldId} aria-invalid={Boolean(error)} aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined} />
      {error ? <span className={styles.error} id={errorId}>{error}</span> : null}
    </div>
  );
}
