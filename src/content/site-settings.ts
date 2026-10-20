import { mediaRegistry, publicationMediaSlots } from "@/lib/media";

// Keep false until a real, privacy-approved lead adapter is implemented and tested.
const leadDeliveryImplemented = false;

export const siteSettings = {
  publicBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  phone: process.env.OVELVET_PHONE || "+7 (910) 452-87-79",
  email: process.env.OVELVET_EMAIL || "info@otagan.ru",
  address: process.env.OVELVET_ADDRESS || "Леснорядская улица, 18с14",
  messengers: (process.env.OVELVET_MESSENGERS ?? "").split(",").map((value) => value.trim()).filter(Boolean),
  legalName: process.env.OVELVET_LEGAL_NAME ?? "",
  privacyApproved: process.env.PRIVACY_APPROVED === "true",
  leadTransportApproved: leadDeliveryImplemented && process.env.LEAD_TRANSPORT_APPROVED === "true",
  realProjectMediaApproved: process.env.PROJECT_MEDIA_APPROVED === "true" && publicationMediaSlots.every((slot) => {
    const media = mediaRegistry[slot];
    return !media.isPlaceholder && media.rightsConfirmed;
  })
};

export function publicSiteReadiness() {
  const requirements: Array<[string, boolean]> = [
    ["publicBaseUrl", Boolean(siteSettings.publicBaseUrl)],
    ["legalName", Boolean(siteSettings.legalName)],
    ["privacyApproved", siteSettings.privacyApproved],
    ["leadTransportApproved", siteSettings.leadTransportApproved],
    ["realProjectMediaApproved", siteSettings.realProjectMediaApproved]
  ];
  const missing = requirements.filter(([, ready]) => !ready).map(([name]) => name);
  return { ready: missing.length === 0, missing };
}
