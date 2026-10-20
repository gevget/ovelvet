"use client";

import { useSearchParams } from "next/navigation";
import { EstimateWizard } from "@/components/estimate-wizard";

export function CostEstimate() {
  const searchParams = useSearchParams();
  const audience = searchParams.get("type");
  const initialAudience = audience === "home" || audience === "business" ? audience : "both";

  return <EstimateWizard key={initialAudience} initialAudience={initialAudience} />;
}
