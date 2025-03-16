import { Component } from "solid-js";

export const TableCell: Component<{ children: any }> = (props) => {
  return (
    <td class="p-2 text-start text-xs">
      <div class="flex flex-row items-center justify-start">
        {props.children}
      </div>
    </td>
  );
};
