import { Accessor, Component, Setter, Show } from "solid-js";
import Popover from "@corvu/popover";
import HelpIcon from "../../icons/help";

const InputFieldText: Component<{
  slug: string;
  label: string;
  accessor: Accessor<string>;
  setter: Setter<string>;
  validator: (val: string) => boolean;
  inputRestrictor: (val: string) => boolean;
  children?: any;
}> = (props) => {
  return (
    <div class="mb-3 flex flex-col">
      <label for={props.slug} class="mb-2">
        {props.label}: <span class="text-red-600">*</span>
        <Show when={props.children}>
          <Popover
            floatingOptions={{
              offset: 13,
              flip: true,
              shift: true,
            }}
          >
            <Popover.Trigger class="my-auto mx-3 rounded-full bg-neutral-500 p-1 transition-all duration-100 hover:bg-neutral-600 active:translate-y-0.5 cursor-pointer">
              <HelpIcon class="fill-white w-3 h-3" />
              <span class="sr-only">Help</span>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content class="z-50 rounded-lg bg-neutral-500 px-3 py-2 shadow-md data-open:animate-in data-open:fade-in-50% data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-50% data-closed:slide-out-to-top-1">
                {props.children}
                <Popover.Arrow class="text-neutral-500" />
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        </Show>
      </label>
      <input
        type="text"
        id={props.slug}
        name={props.slug}
        value={props.accessor()}
        class="p-2 outline-white border rounded-md invalid:border-pink-500 invalid:text-pink-600 focus:border-amber-400 focus:outline focus:outline-amber-400 focus:invalid:border-pink-500 focus:invalid:outline-pink-500"
        oninput={(e) => {
          props.setter(e.target.value);
          const val = e.target.value;
          if (props.validator(val)) {
            e.target.setCustomValidity("");
          } else {
            e.target.setCustomValidity("Invalid");
          }
        }}
        onBeforeInput={(e) => {
          if (e.data != null && !props.inputRestrictor(e.data)) {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default InputFieldText;
