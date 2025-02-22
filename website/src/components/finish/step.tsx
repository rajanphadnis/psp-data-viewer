import { Component, Match, Show, Switch } from "solid-js";
import { ProvisioningStatus } from "../../types";

const Step: Component<{ title: string; desc: string; children: any; status: ProvisioningStatus }> = (props) => {

    return <li class="mb-10 ms-6 text-start">
        <Switch >
            <Match when={props.status == ProvisioningStatus.SUCCEEDED}>
                <span class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-gray-900 bg-green-900 mt-1">
                    <svg class="w-3.5 h-3.5 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                    </svg>
                </span>
            </Match>
            <Match when={props.status == ProvisioningStatus.DEPLOYING}>
                <span class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-gray-900 bg-yellow-900 mt-1">
                    <div class="loader w-4 h-4 border-t-2 border-2"></div>
                </span>
            </Match>
            <Match when={props.status == ProvisioningStatus.FAILED}>
                <span class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-gray-900 bg-red-950 mt-1">
                    <svg class="w-3 h-3 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M0 0 10 10ZM0 10 10 0Z" />
                    </svg>
                </span>
            </Match>
            <Match when={props.status == ProvisioningStatus.PENDING}>
                <span class="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-gray-900 bg-neutral-900 mt-1">
                    {props.children}
                </span>
            </Match>
        </Switch>
        <div class="ml-2">
            <h3 class={`font-medium leading-tight ${props.desc == "" ? "pt-2.5" : ""}`}>{props.title}</h3>
            <Show when={props.desc != ""}>
                <p class="text-sm">{props.desc}</p>
            </Show>
        </div>
    </li>;
};

export default Step;