// export interface DatasetStatus {
//   to_add: string[];
//   loading: string[];
//   cached: string[];
//   all: string[];
// }
export interface AllTests {
  id: string;
  name: string;
  test_article: string;
  gse_article: string;
  initial_timestamp: number;
}

export const enum loadingStatus {
  LOADING,
  DONE,
}

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
