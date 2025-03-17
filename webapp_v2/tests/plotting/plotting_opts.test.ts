import { createSignal } from "solid-js";
import { expect, test, vi } from "vitest";
import { generatePlottingOptions } from "../../src/plotting/plotting_opts";
import {
  Annotation,
  DatasetAxis,
  MeasureData,
  PlotRange,
  TestBasics,
} from "../../src/types";
import * as plottingHelpers from "../../src/plotting/plotting_helpers";

vi.mock("uplot", () => ({
  default: vi.fn(),
}));

vi.mock("../../src/plotting/plotting_helpers", async () => {
  const actual = await vi.importActual("../../src/plotting/plotting_helpers");
  return {
    ...actual,
    getSize: vi.fn().mockReturnValue({ width: 0, height: 0 }),
  };
});
test("rounds null legend values", () => {
  const axes = [
    {
      stroke: "#fff",
      grid: { stroke: "#ffffff20" },
      ticks: { show: true, stroke: "#80808080" },
    },
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
      show: false,
      scale: "annotation",
      grid: { show: false },
      ticks: { show: false },
    },
  ];
  const [plotRange, setPlotRange] = createSignal<PlotRange>({
    start: 0,
    end: 0,
  });
  const [testBasics, setTestBasics] = createSignal<TestBasics>({
    name: "Loading...",
    gse_article: "",
    test_article: "",
    id: "",
    starting_timestamp: 0,
    ending_timestamp: 0,
    datasets: [""],
  });
  const [activeDatasets, setActiveDatasets] = createSignal<string[]>([]);
  const [measuring, setMeasuring] = createSignal<MeasureData>({
    x1: undefined,
    x2: undefined,
    y1: [],
    y2: [],
    toolColor: "#ffa500",
  });
  const [currentAnnotation, setCurrentAnnotation] = createSignal<
    Annotation | undefined
  >(undefined);
  let annotationRef!: HTMLButtonElement;
  expect(
    JSON.stringify(
      generatePlottingOptions(
        axes as unknown as DatasetAxis[],
        [{}],
        setPlotRange,
        testBasics,
        activeDatasets,
        measuring,
        [],
        setMeasuring,
        [],
        [],
        annotationRef,
        setCurrentAnnotation,
        0,
        false,
      ),
    ),
  ).toBe(
    JSON.stringify({
      width: 0,
      height: 0,
      series: [{}],
      axes: [
        {
          stroke: "#fff",
          grid: { stroke: "#ffffff20" },
          ticks: { show: true, stroke: "#80808080" },
        },
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
          show: false,
          scale: "annotation",
          grid: { show: false },
          ticks: { show: false },
        },
      ],
      padding: [null, 8, null, 6],
      hooks: {
        init: [null],
        draw: [null],
        setSelect: [null],
        setCursor: [null],
      },
      scales: {
        x: { time: true },
        annotation: { auto: false, range: [0.1, 0.9], time: false },
      },
      legend: { show: true, markers: { show: false }, isolate: false },
    }),
  );
  // expect()
  expect(plottingHelpers.getSize).toHaveBeenCalled();
});
