import { expect, test, vi } from "vitest";
import { formatTimeDelta } from "../../src/browser/measure";

test("format time string: 1s", () => {
  expect(formatTimeDelta(1000)).toBe("01s");
});

test("format time string: 1.2s", () => {
  expect(formatTimeDelta(1200)).toBe("01.2s");
});

test("format time string: mins", () => {
  expect(formatTimeDelta(130200)).toBe("2m10.2s");
});
