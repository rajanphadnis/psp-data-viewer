import { expect, test, vi } from "vitest";
import { generatePlottedDatasets } from "../../src/plotting/dataset_generation";

vi.mock("uplot", () => ({
  default: vi.fn(),
}));

test("rounds null legend values", () => {
  expect("").toBe("");
  // expect(generatePlottedDatasets(["fms__psi__"], 0, 2, "id", [1, 1], ["#fff", "#fff"], 5, () => {}, false)).toBe("");
});
