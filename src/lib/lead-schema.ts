import { z } from "zod";

const blankToUndefined = (value: unknown) => typeof value === "string" && value.trim() === "" ? undefined : value;
const safePlanLink = z.string().max(2000).url().refine((value) => {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}, "Введите ссылку, начинающуюся с http:// или https://.");

export const leadSchema = z.object({
  source: z.enum(["cost", "contact", "designer"]),
  audience: z.enum(["home", "business", "both"]),
  projectType: z.enum(["flat", "house", "office", "hotel", "restaurant", "other"]).optional(),
  wallAreaM2: z.number().positive().max(100_000).optional(),
  areaUnknown: z.boolean().optional(),
  materialPreference: z.preprocess(blankToUndefined, z.string().max(160).optional()),
  acousticInterest: z.boolean().optional(),
  name: z.preprocess(blankToUndefined, z.string().max(100).optional()),
  phone: z.preprocess(blankToUndefined, z.string().max(40).optional()),
  email: z.preprocess(blankToUndefined, z.email().max(254).optional()),
  comment: z.preprocess(blankToUndefined, z.string().max(2000).optional()),
  planLink: z.preprocess(blankToUndefined, safePlanLink.optional()),
  consentVersion: z.literal("preview-v1"),
  consentGranted: z.literal(true),
  website: z.string().max(0).optional()
}).superRefine((lead, context) => {
  if (!lead.phone && !lead.email) {
    context.addIssue({ code: "custom", path: ["contact"], message: "Укажите телефон или электронную почту." });
  }
  if (lead.phone && !/^\+?[\d\s().-]{7,24}$/.test(lead.phone)) {
    context.addIssue({ code: "custom", path: ["phone"], message: "Проверьте формат телефона." });
  }
});

export type LeadInput = z.infer<typeof leadSchema>;
