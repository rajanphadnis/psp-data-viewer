import { expect, test, vi } from "vitest";
import { generateAxisAndSeries } from "../../src/plotting/axes_series_generation";

vi.mock("uplot", () => ({
  default: vi.fn(),
}));

test("generate a single axis series", () => {
  const expected = JSON.stringify({ label: "fms", stroke: "#fff", width: 2, scale: " psi_1", spanGaps: true });
  expect(JSON.stringify(generateAxisAndSeries(" psi", "", "fms", 0, ["#fff", "#fff"], 1))).toBe(expected);
});
