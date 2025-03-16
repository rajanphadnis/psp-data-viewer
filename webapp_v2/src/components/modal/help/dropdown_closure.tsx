import Disclosure from "@corvu/disclosure";
import { Component, JSXElement } from "solid-js";
import { ChevronDownIcon, ChevronUpIcon } from "../../icons/chevron_up_down";

const DropdownClosure: Component<{ children: any; title: JSXElement }> = (
  props,
) => {
  return (
    <Disclosure collapseBehavior="hide">
      {(propsDisclosure) => (
        <>
          <div class="mb-2 flex items-center justify-between space-x-4">
            {props.title}
            <Disclosure.Trigger class="cursor-pointer rounded-lg bg-amber-400 p-1 transition-all duration-100 hover:bg-amber-300 active:translate-y-0.5">
              {propsDisclosure.expanded && (
                <>
                  <ChevronDownIcon class="w-5" />
                  <span class="sr-only">Collapse</span>
                </>
              )}
              {!propsDisclosure.expanded && (
                <>
                  <ChevronUpIcon class="w-5" />
                  <span class="sr-only">Expand</span>
                </>
              )}
            </Disclosure.Trigger>
          </div>
          <Disclosure.Content class="data-expanded:animate-expand data-collapsed:animate-collapse mt-1 space-y-1 overflow-hidden">
            {props.children}
          </Disclosure.Content>
        </>
      )}
    </Disclosure>
  );
};

export default DropdownClosure;
