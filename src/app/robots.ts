import type { MetadataRoute } from "next";
import { isPublicMode, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!isPublicMode) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/projects/", "/contacts/", "/privacy/", "/about/"] }, host: siteUrl, sitemap: `${siteUrl}/sitemap.xml` };
}
