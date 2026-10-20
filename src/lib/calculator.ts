export function parseWallArea(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return Number.NaN;
  const area = Number(normalized);
  if (!Number.isFinite(area) || area <= 0 || area > 100_000) return Number.NaN;
  return area;
}
