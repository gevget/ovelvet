import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead-schema";

const baseLead = {
  source: "cost",
  audience: "home",
  consentVersion: "preview-v1",
  consentGranted: true
};

describe("leadSchema", () => {
  it("accepts an estimate without area when the visitor has one contact channel", () => {
    const parsed = leadSchema.safeParse({ ...baseLead, areaUnknown: true, email: "preview@example.invalid" });
    expect(parsed.success).toBe(true);
  });

  it("requires phone or email", () => {
    const parsed = leadSchema.safeParse(baseLead);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues.map((issue) => issue.path[0])).toContain("contact");
  });

  it("requires the demo consent", () => {
    const parsed = leadSchema.safeParse({ ...baseLead, consentGranted: false, email: "preview@example.invalid" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues.map((issue) => issue.path[0])).toContain("consentGranted");
  });

  it("rejects an unsafe or oversized wall area", () => {
    expect(leadSchema.safeParse({ ...baseLead, wallAreaM2: Infinity, email: "preview@example.invalid" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...baseLead, wallAreaM2: 100001, email: "preview@example.invalid" }).success).toBe(false);
  });
});
