import { beforeEach, describe, expect, test, vi } from "vitest";
import { decode, encode, getQueryVariable, getSharelink, loadFromShareLink } from "../../src/browser/sharelink";
import { createSignal, Signal } from "solid-js";
import { PlotRange, TestBasics } from "../../src/types";

// vi.stubGlobal("location", {
//   pathname: "/path",
//   origin: "https://pspl.space",
// });

// vi.stubGlobal("window", {
//   location: {
//     pathname: "/path",
//     origin: "https://pspl.space",
//     search: "?b64=Zm1zX19sYmZfXzo6OjE3MzA1OTIwMDAwMDI6OjoxNzMwNjA2NDkyOTI5Ojo6MQ==",
//   },
// });

// describe("location-reliant tests", () => {
beforeEach(() => {
  vi.unstubAllGlobals();
});
// });
test("encode to b64", () => {
  expect(encode("test")).toBe("dGVzdA==");
});

test("decode from b64", () => {
  expect(decode("dGVzdA==")).toBe("test");
});

test("create sharelink: good", () => {
  vi.stubGlobal("location", {
    pathname: "/path",
    origin: "https://pspl.space",
  });
  const expected = ["https://pspl.space/path?b64=b25lLHR3bzo6OjA6OjoyOjo6MSwy", "b25lLHR3bzo6OjA6OjoyOjo6MSwy"];
  const fxnRun = getSharelink(["one", "two"], 0, 2, [1, 2]);
  expect(fxnRun[0]).toBe(expected[0]);
  expect(fxnRun[1]).toBe(expected[1]);
  expect(fxnRun.length).toBe(expected.length);
});

test("create sharelink: no datasets", () => {
  vi.stubGlobal("location", {
    pathname: "/path",
    origin: "https://pspl.space",
  });
  const expected = ["https://pspl.space/path", ""];
  const fxnRun = getSharelink([], 0, 2, [1, 2]);
  expect(fxnRun[0]).toBe(expected[0]);
  expect(fxnRun[1]).toBe(expected[1]);
  expect(fxnRun.length).toBe(expected.length);
});

test("read query params", () => {
  vi.stubGlobal("window", {
    location: {
      pathname: "/path",
      origin: "https://pspl.space",
      search: "?b64=Zm1zX19sYmZfXzo6OjE3MzA1OTIwMDAwMDI6OjoxNzMwNjA2NDkyOTI5Ojo6MQ==",
    },
  });
  expect(getQueryVariable("b64")).toBe("Zm1zX19sYmZfXzo6OjE3MzA1OTIwMDAwMDI6OjoxNzMwNjA2NDkyOTI5Ojo6MQ");
});

test("read query params: failure", () => {
  vi.stubGlobal("window", {
    location: {
      pathname: "/path",
      origin: "https://pspl.space",
      search: "?b64=Zm1zX19sYmZfXzo6OjE3MzA1OTIwMDAwMDI6OjoxNzMwNjA2NDkyOTI5Ojo6MQ==",
    },
  });
  expect(getQueryVariable("b6")).toBe(undefined);
});

test("load from sharelink", () => {
  vi.stubGlobal("window", {
    location: {
      pathname: "/path",
      origin: "https://pspl.space",
      search: "?b64=Zm1zX19sYmZfXzo6OjE3MzA1OTIwMDAwMDI6OjoxNzMwNjA2NDkyOTI5Ojo6MQ==",
    },
  });
  const init_testData: TestBasics = {
    name: "Loading...",
    gse_article: "",
    test_article: "",
    id: "",
    starting_timestamp: 0,
    ending_timestamp: 0,
    datasets: [""],
  };
  const [testBasics, setTestBasics]: Signal<TestBasics> = createSignal(init_testData);
  const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());
  const [plotRange, setPlotRange]: Signal<PlotRange> = createSignal({ start: 0, end: 0 });
  const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  expect(testBasics()).toBe(init_testData);
  expect(datasetsLegendSide()).toStrictEqual([]);
  expect(plotRange()).toStrictEqual({ start: 0, end: 0 });
  expect(activeDatasets()).toStrictEqual([]);

  loadFromShareLink(testBasics, setPlotRange, setDatasetsLegendSide, setActiveDatasets);

  expect(testBasics()).toBe(init_testData);
  expect(datasetsLegendSide()).toStrictEqual([1]);
  expect(plotRange()).toStrictEqual({ start: 1730592000002, end: 1730606492929 });
  expect(activeDatasets()).toStrictEqual(["fms__lbf__"]);
});

test("load from sharelink: no sharelink", () => {
  vi.stubGlobal("window", {
    location: {
      pathname: "/path",
      origin: "https://pspl.space",
      search: "",
    },
  });
  const init_testData: TestBasics = {
    name: "Loading...",
    gse_article: "",
    test_article: "",
    id: "",
    starting_timestamp: 0,
    ending_timestamp: 0,
    datasets: [""],
  };
  const [testBasics, setTestBasics]: Signal<TestBasics> = createSignal(init_testData);
  const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());
  const [plotRange, setPlotRange]: Signal<PlotRange> = createSignal({ start: 0, end: 0 });
  const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  expect(testBasics()).toBe(init_testData);
  expect(datasetsLegendSide()).toStrictEqual([]);
  expect(plotRange()).toStrictEqual({ start: 0, end: 0 });
  expect(activeDatasets()).toStrictEqual([]);

  loadFromShareLink(testBasics, setPlotRange, setDatasetsLegendSide, setActiveDatasets);

  expect(testBasics()).toBe(init_testData);
  expect(datasetsLegendSide()).toStrictEqual([]);
  expect(plotRange()).toStrictEqual({ start: 0, end: 0 });
  expect(activeDatasets()).toStrictEqual([]);
});
