import { Component, createMemo, createSignal } from "solid-js";
import PricingItemSelector from "./pricing/pricing_item";

const PricingSegment: Component<{}> = (props) => {
  const [apiReqs, setApiReqs] = createSignal<number>(100);
  const [createTest, setCreateTest] = createSignal<number>(1);
  const [dataStorage, setDataStorage] = createSignal<number>(5);

  const totalCost = createMemo<string>(() => {
    const apiCost = apiConverter(apiReqs());
    const testCost = testConverter(createTest());
    const dataCost = dataConverter(dataStorage());
    const totalCost = `$${(apiCost + testCost + dataCost).toFixed(2)}`;
    return totalCost;
  });

  return (
    <div id="pricing" class="pt-12 px-5">
      <h1 class="text-3xl font-bold mb-3 text-center">Pricing</h1>
      <p class="mb-6 text-center">Simple, clear-cut pricing that pays for itself</p>
      <div class="flex flex-row max-md:flex-col">
        <div class="flex flex-col bg-neutral-950 rounded-2xl p-6 w-1/2 mr-4 max-md:mr-0 max-md:w-full">
          {/* <h3 class="text-xl">Pricing is based on the following categories:</h3> */}
          <p>
            At the end of each billing cycle, API requests, tests created, and total data stored is tallied and billed
            accordingly:
          </p>
          <div class="flex flex-col justify-center h-full max-md:mt-6">
            <p>API requests:</p>
            <ul class="ml-5">
              <li>0-250: $0.001/request</li>
              <li>251-500: $0.005/req + $2/month</li>
              <li>501+: $0.01/req + $5/month</li>
            </ul>
            <p>Create test: $1.00/test</p>
            <p>Data Storage: $0.03/GB</p>
          </div>
        </div>
        <div class="flex flex-col bg-neutral-950 rounded-2xl p-6 w-1/2 ml-4 max-md:ml-0 max-md:w-full max-md:mt-4">
          <h1 class="text-xl mb-6">Calculator</h1>
          <PricingItemSelector
            name="API Requests"
            min={0}
            max={1000}
            step={50}
            accessor={apiReqs}
            setter={setApiReqs}
            rawToCost={apiConverter}
          />
          <PricingItemSelector
            name="Created Tests"
            min={0}
            max={20}
            step={1}
            accessor={createTest}
            setter={setCreateTest}
            rawToCost={testConverter}
          />
          <PricingItemSelector
            name="Stored Data (GB)"
            min={1}
            max={100}
            step={1}
            accessor={dataStorage}
            setter={setDataStorage}
            rawToCost={dataConverter}
          />
          <p class="text-lg mt-3">Total Cost: {totalCost()}/month</p>
        </div>
      </div>
    </div>
  );
};

export default PricingSegment;

function apiConverter(raw: number) {
  if (raw < 250) {
    return raw * 0.001;
  }
  if (raw < 500) {
    return raw * 0.005 + 2;
  } else {
    return raw * 0.01 + 5;
  }
}

function testConverter(raw: number) {
  return raw * 1;
}

function dataConverter(raw: number) {
  return raw * 0.03;
}
