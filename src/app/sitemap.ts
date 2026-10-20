import type { MetadataRoute } from "next";
import { getVisibleArticles } from "@/lib/content";
import { absoluteSitePath, isPublicMode } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicMode) return [];
  const pages = ["/", "/stretch-walls/", "/home/", "/business/", "/technology/", "/materials/", "/cost/", "/designers/", ...(getVisibleArticles().length ? ["/articles/"] : [])];
  const articles = getVisibleArticles().map(({ slug }) => `/articles/${slug}/`);
  return [...pages, ...articles].map((path) => ({ url: absoluteSitePath(path), changeFrequency: "monthly", priority: path === "/" ? 1 : 0.7 }));
}
