import { Accessor, Setter } from "solid-js";

export type TestBasics = {
  id: string;
  name: string;
  test_article: string;
  gse_article: string;
  starting_timestamp: number | undefined;
  ending_timestamp: number | undefined;
  // datasets: string[] | undefined;
};

export type LoadingStateType = {
  isLoading: boolean;
  statusMessage: string;
};

export type TestData = {
  datasets: string[];
  ending_timestamp: number;
  gse_article: string;
  id: string;
  name: string;
  test_article: string;
  starting_timestamp: number;
};

export type State = [
  Accessor<TestBasics[]>,
  Setter<TestBasics[]>,
  Accessor<LoadingStateType>,
  Setter<LoadingStateType>,
  Accessor<string>,
  Setter<string>,
  Accessor<string>,
  Setter<string>,
  Accessor<string>,
  Setter<string>,
  Accessor<string[] | null>,
  Setter<string[] | null>,
  Accessor<string | undefined>,
  Setter<string | undefined>
];

export type BillingData = {
  date: number;
  value: number;
};

export type InvoiceData = {
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  billing_reason: string;
  collection_method: string;
  next_payment_attempt: number;
  period_end: number;
  period_start: number;
};

export type AccessControlDoc = {
  [email: string]: string[];
};

export type PermissionType = {
  [perm: string]: string;
};
