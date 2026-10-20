import { describe, expect, it } from "vitest";
import { parseWallArea } from "./calculator";

describe("parseWallArea", () => {
  it("accepts a decimal with a comma", () => expect(parseWallArea("125,5")).toBe(125.5));
  it("allows an empty value for the unknown area flow", () => expect(parseWallArea(" ")).toBeNull());
  it.each(["0", "-1", "100000.01", "NaN", "1,2,3"])("rejects %s", (value) => expect(Number.isNaN(parseWallArea(value))).toBe(true));
});
