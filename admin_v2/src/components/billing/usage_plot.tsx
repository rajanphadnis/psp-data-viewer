import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import { httpsCallable } from "firebase/functions";
import { Line } from "solid-chartjs";
import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { BillingData } from "../../types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import moment from "moment";

const BillingUsagePlot: Component<{}> = (props) => {
  const [data, setData] = createSignal<BillingData[]>();
  // const [derivativeData, setDerivativeData] = createSignal<BillingData[]>([] as BillingData[]);
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  createEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const getUsage = httpsCallable(globalThis.functions, "fetchMeterUsage");
        getUsage().then((result) => {
          /** @type {any} */
          const data: any = result.data;
          console.log(data);
          const list = data["meter"]["data"] as any[];
          let toSet: BillingData[] = [];
          let toSetDerivative: BillingData[] = [];
          list.forEach((dataPoint) => {
            const newObject = { value: dataPoint["aggregated_value"], date: dataPoint["end_time"] } as BillingData;
            toSet.push(newObject);
            console.log(newObject);
          });
          toSet.sort((a, b) => a.date - b.date);
          const newDerivativeObject = { value: toSet[0].value, date: toSet[0].date } as BillingData;
          toSetDerivative.push(newDerivativeObject);
          for (let i = 1; i < toSet.length; i++) {
            const derivative = toSet[i].value - toSet[i - 1].value;
            const newDerivativeObjectIter = { value: derivative, date: toSet[i].date } as BillingData;
            toSetDerivative.push(newDerivativeObjectIter);
          }
          setData(toSet);
          // setDerivativeData(toSetDerivative);
        });
      }
    });
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div class="w-full px-10">
      <Show when={data()} fallback={<p class="w-full text-center">Loading...</p>}>
        <Line
          data={{
            labels: data()!.map((row) => {
              return moment(row.date * 1000).format("M/D/YYYY H:mm");
            }),
            datasets: [
              {
                label: "Aggregated",
                data: data()!.map((row) => row.value),
              }
              // {
              //   label: "Count",
              //   data: derivativeData().map((row) => row.value),
              // },
            ],
          }}
          options={chartOptions}
          // width={500}
          // height={500}
        />
      </Show>
    </div>
  );
};

export default BillingUsagePlot;
