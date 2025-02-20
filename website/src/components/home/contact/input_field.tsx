import { Accessor, Component, Setter } from "solid-js";

const InputFieldText: Component<{
  slug: string;
  label: string;
  accessor: Accessor<string>;
  setter: Setter<string>;
  validator: (val: string) => boolean;
}> = (props) => {
  return (
    <div class="mb-3 flex flex-col">
      <label for={props.slug}>
        {props.label}: <span class="text-red-600">*</span>
      </label>
      {/* <br /> */}
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
      />
    </div>
  );
};

export default InputFieldText;
