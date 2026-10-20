import styles from "./markdown-content.module.css";

export function MarkdownContent({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`${styles.content} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
