export type SingleMeasurement = {
  name: string;
  units: string;
  measurement: string;
}

export type MeasureData = {
  x1: number | undefined;
  x2: number | undefined;
  y1: number[];
  y2: number[];
  toolColor: string;
}

export type TestBasics = {
  id: string;
  name: string;
  test_article: string;
  gse_article: string;
  starting_timestamp: number | undefined;
  ending_timestamp: number | undefined;
  datasets: string[] | undefined;
};

export type LoadingStateType = {
  isLoading: boolean;
  statusMessage: string;
};

export type PlotRange = {
  start: number;
  end: number;
};

export interface DatasetSeries {
  label: string;
  value: (self: any, rawValue: number) => string;
  stroke: string;
  width: number;
  scale: string;
  spanGaps: boolean;
}

export interface DatasetAxis {
  scale: string;
  values: (u: any, vals: any[], space: any) => string[];
  stroke: string;
  grid: {
    stroke: string;
  };
  side: number;
  ticks: {
    show: boolean;
    stroke: string;
  };
}

export interface CalcChannel {
  formula: string;
  newChannelName: string;
  axisSide: number;
  units: string;
  var_mapping: {
    var_name: string;
    source_channel: string;
  }[];
}

export type Preferences = {
  displayedSamples: number;
  axesSets: number;
};

declare global {
  interface Window {
      dataLayer:any;
  }
}