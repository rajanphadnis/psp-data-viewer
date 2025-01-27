import { Component } from "solid-js";
import BillingUsagePlot from "./usage_plot";
import NextInvoice from "./next_invoice";
import PortalButton from "./portal_button";

const Billing: Component<{}> = (props) => {
  return (
    <div class="px-6 flex flex-col items-center justify-around h-full">
      <h1 class="text-lg font-bold">API Usage over the past week:</h1>
      <BillingUsagePlot />
      <div class="flex flex-row w-full justify-around items-center">
        <NextInvoice />
        <PortalButton />
      </div>
    </div>
  );
};

export default Billing;
