import { Accessor, createContext, createSignal, Setter, Signal, useContext } from "solid-js";
import { SiteStatus } from "./types.js";
import { Buffer } from "buffer";

const AppStateContext = createContext();

export function AppStateProvider(props: any) {
  const [siteStatus, setSiteStatus] = createSignal<SiteStatus>(SiteStatus.UNKNOWN);

  const datasetsThing = [siteStatus, setSiteStatus];

  return <AppStateContext.Provider value={datasetsThing}>{props.children}</AppStateContext.Provider>;
}

export function useState(): [Accessor<SiteStatus>, Setter<SiteStatus>] {
  return useContext(AppStateContext) as any;
}

export const decode = (str: string): string => Buffer.from(str, "base64").toString("binary");
export const encode = (str: string): string => Buffer.from(str, "binary").toString("base64");
