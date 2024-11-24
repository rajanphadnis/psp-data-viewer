import { expect, test, vi } from "vitest";
import { getDatasetPlottingColor } from "../../src/theming";

test("dataset plotting color: non overflow", () => {
  expect(getDatasetPlottingColor(["1", "2", "3", "4", "5"], 1)).toBe("2");
});

test("dataset plotting color: overflow", () => {
  expect(getDatasetPlottingColor(["1", "2", "3", "4", "5"], 20)).toBe("1");
});
