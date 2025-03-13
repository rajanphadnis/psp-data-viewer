import { expect, test, vi } from "vitest";
import { generateAllAxes, generateAxes, legendRound } from "../../src/plotting/plotting_helpers";

vi.mock("uplot", () => ({
  default: vi.fn(),
}));

test("rounds null legend values", () => {
  expect(legendRound(null, "")).toBe("");
});

test("rounds undefined legend values", () => {
  expect(legendRound(undefined, "")).toBe("");
});

test("rounds null string legend values", () => {
  expect(legendRound("null", "")).toBe("");
});

test("rounds 0, psi, 2 dec", () => {
  expect(legendRound(0, " psi")).toBe("0.00 psi");
});

test("rounds 0.00, psi, 2 dec", () => {
  expect(legendRound(0.0, " psi")).toBe("0.00 psi");
});

test("rounds -2, psi, 2 dec", () => {
  expect(legendRound(-2, " psi")).toBe("-2.00 psi");
});

test("rounds -2, psi, 4 dec", () => {
  expect(legendRound(-2, " psi", 4)).toBe("-2.0000 psi");
});

test("rounds -2.123456, psi, 4 dec", () => {
  expect(legendRound(-2.123456, " psi", 4)).toBe("-2.1235 psi");
});

test("rounds 0.00, bin, 2 dec", () => {
  expect(legendRound(0, " bin")).toBe("Closed");
});

test("rounds 0.5, bin, 2 dec", () => {
  expect(legendRound(0.5, " bin")).toBe("Closed");
});

test("rounds 0.500001, bin, 2 dec", () => {
  expect(legendRound(0.500001, " bin")).toBe("Open");
});

test("rounds 1, bin, 2 dec", () => {
  expect(legendRound(1, "test")).toBe("1.00test");
});

test("generate axes: 1", () => {
  const expected = JSON.stringify([
    {
      scale: "lbf_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "psi_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "V_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "bin_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "deg_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
  ]);

  expect(JSON.stringify(generateAxes(1))).toEqual(expected);
});

test("generate all axes: 1", () => {
  const expected = JSON.stringify([
    { stroke: "#fff", grid: { stroke: "#ffffff20" }, ticks: { show: true, stroke: "#80808080" } },
    {
      scale: "lbf_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "psi_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "V_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "bin_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "deg_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      "show": false,
      "scale": "annotation",
      "grid": { "show": false },
      "ticks": { "show": false }
    }
  ]);

  expect(JSON.stringify(generateAllAxes(1))).toEqual(expected);
});

test("generate all axes: 3", () => {
  const expected = JSON.stringify([
    { stroke: "#fff", grid: { stroke: "#ffffff20" }, ticks: { show: true, stroke: "#80808080" } },
    {
      scale: "lbf_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "psi_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "V_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "bin_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "deg_1",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "lbf_2",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 1,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "psi_2",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 1,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "V_2",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 1,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "bin_2",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 1,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "deg_2",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 1,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "lbf_3",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "psi_3",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "V_3",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "bin_3",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      scale: "deg_3",
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      side: 3,
      ticks: { show: true, stroke: "#80808080" },
    },
    {
      "show": false,
      "scale": "annotation",
      "grid": { "show": false },
      "ticks": { "show": false }
    }
  ]);

  expect(JSON.stringify(generateAllAxes(3))).toEqual(expected);
});
