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
  sizes: string;
};

const responsiveWidths = [360, 768, 1024];

export function PlaceholderMedia({ slot, label, priority = false, className = "", showCaption = true, sizes }: Props) {
  const media = mediaRegistry[slot];
  if (isPublicMode && media.isPlaceholder) return null;
  const responsiveSrcSet = media.src.endsWith(".webp")
    ? [
        ...responsiveWidths.filter((width) => width < media.width).map((width) => `${media.src.replace(/\.webp$/u, `-${width}w.webp`)} ${width}w`),
        `${media.src} ${media.width}w`
      ].join(", ")
    : undefined;

  return (
    <figure className={`${styles.frame} ${styles[media.variant]} ${className}`}>
      <picture>
        {media.mobileSrc ? <source media="(max-width: 767px)" srcSet={media.mobileSrc} /> : null}
        {responsiveSrcSet ? <source type="image/webp" srcSet={responsiveSrcSet} sizes={sizes} /> : null}
        <Image src={media.src} alt={media.isPlaceholder ? "" : media.alt} width={media.width} height={media.height} priority={priority} loading={priority ? "eager" : undefined} sizes={sizes} className={styles.image} unoptimized={media.isPlaceholder || media.src.endsWith(".svg")} />
      </picture>
      {showCaption && (media.isPlaceholder || media.caption) ? <figcaption className={styles.caption}><span className={styles.marker} aria-hidden="true">{media.isPlaceholder ? "OV" : "ВИЗ"}</span><span>{media.isPlaceholder ? label ?? "PHOTO PLACEHOLDER / изображение будет добавлено" : media.caption}</span></figcaption> : null}
    </figure>
  );
}
