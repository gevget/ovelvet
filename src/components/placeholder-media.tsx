import Image from "next/image";
import { isPublicMode } from "@/lib/site";
import { mediaRegistry, type MediaSlot } from "@/lib/media";
import styles from "./placeholder-media.module.css";

type Props = {
  slot: MediaSlot;
  label?: string;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
};

export function PlaceholderMedia({ slot, label, priority = false, className = "", showCaption = true }: Props) {
  const media = mediaRegistry[slot];
  if (isPublicMode && media.isPlaceholder) return null;

  return (
    <figure className={`${styles.frame} ${styles[media.variant]} ${className}`}>
      <picture>
        {media.mobileSrc ? <source media="(max-width: 767px)" srcSet={media.mobileSrc} /> : null}
        <Image src={media.src} alt={media.isPlaceholder ? "" : media.alt} width={media.width} height={media.height} priority={priority} loading={priority ? "eager" : undefined} sizes="(max-width: 767px) 100vw, (max-width: 1280px) 90vw, 1280px" className={styles.image} unoptimized={media.isPlaceholder || media.src.endsWith(".svg")} />
      </picture>
      {showCaption && (media.isPlaceholder || media.caption) ? <figcaption className={styles.caption}><span className={styles.marker} aria-hidden="true">{media.isPlaceholder ? "OV" : "ВИЗ"}</span><span>{media.isPlaceholder ? label ?? "PHOTO PLACEHOLDER / изображение будет добавлено" : media.caption}</span></figcaption> : null}
    </figure>
  );
}
