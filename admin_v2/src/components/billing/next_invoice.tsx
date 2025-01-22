import { onAuthStateChanged, getAuth } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { BillingData, InvoiceData } from "../../types";
import moment from "moment";

const NextInvoice: Component<{}> = (props) => {
  const [nextInvoiceAmount, setnextInvoiceAmount] = createSignal<InvoiceData>();
  createEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const getUsage = httpsCallable(globalThis.functions, "fetchNextInvoice");
        getUsage().then((result) => {
          /** @type {any} */
          const data: any = result.data;
          console.log(data);
          const toSet = {
            amount_due: data["invoice"]["amount_due"],
            amount_paid: data["invoice"]["amount_paid"],
            amount_remaining: data["invoice"]["amount_remaining"],
            billing_reason: data["invoice"]["billing_reason"],
            collection_method: data["invoice"]["collection_method"],
            next_payment_attempt: data["invoice"]["next_payment_attempt"],
            period_end: data["invoice"]["period_end"],
            period_start: data["invoice"]["period_start"],
          } as InvoiceData;
          setnextInvoiceAmount(toSet);
        });
      }
    });
  });

  return (
    <Show
      when={nextInvoiceAmount()}
      fallback={
        <div class="flex flex-col justify-center items-center border border-white p-4 rounded-lg bg-neutral-900 font-bold">
          Loading...
        </div>
      }
    >
      <div class="flex flex-col justify-center items-start border border-white p-4 rounded-lg bg-neutral-900">
        <h1 class="font-bold mb-0">Upcoming Charges:</h1>
        <span class="text-xs font-thin tracking-tighter text-neutral-400 mb-3 mt-0">
          Billing period ({formatDate(nextInvoiceAmount()!.period_start)} -{" "}
          {formatDate(nextInvoiceAmount()!.period_end)})
        </span>
        <div class="flex flex-row">
          <div class="flex flex-col mr-4 border p-2 rounded-lg bg-neutral-800">
            <h1 class="text-xs">Due on {formatDate(nextInvoiceAmount()!.next_payment_attempt, true)}:</h1>
            <h1 class="text-lg">{formatPrice(nextInvoiceAmount()!.amount_due)}</h1>
          </div>
          <div class="flex flex-col mr-4 border p-2 rounded-lg bg-neutral-800">
            <h1 class="text-xs">Paid:</h1>
            <h1 class="text-lg">{formatPrice(nextInvoiceAmount()!.amount_paid)}</h1>
          </div>
          <div class="flex flex-col border p-2 rounded-lg bg-neutral-800">
            <h1 class="text-xs">Remaining:</h1>
            <h1 class="text-lg">{formatPrice(nextInvoiceAmount()!.amount_remaining)}</h1>
          </div>
        </div>
        <p class="text-xs mt-2">
          {nextInvoiceAmount()!.billing_reason}: {nextInvoiceAmount()!.collection_method}
        </p>
      </div>
    </Show>
  );
};

export default NextInvoice;

function formatDate(seconds: number, short: boolean = false) {
  if (short) {
    return moment(seconds * 1000).format("MMM Do");
  } else {
    return moment(seconds * 1000).format("MMM Do, YYYY");
  }
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
