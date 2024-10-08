import { GridStack, type AddRemoveFcn, type GridStackWidget } from "gridstack";
import { loadingStatus } from "../browser/types";
import { updateStatus } from "../dom/status";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { gen_draggable, gen_dropdown, gen_save_button, gen_seating_chart_title, gen_loaded_draggable, gen_trash } from "./web_components";
import { get_default_seating_chart, set_default_seating_chart } from "./caching";

export function update_chart(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) {
  if (querySnapshot.size > 0) {
    const leftDiv = document.getElementById("left-panel")! as HTMLDivElement;
    globalThis.seating_chart = [];
    querySnapshot.forEach((doc) => {
      globalThis.seating_chart.push({
        room_name: doc.data()["name"],
        chart: doc.data()["chart"],
        ref_id: doc.id,
      });
    });
    globalThis.seating_chart.sort((a,b) => (a.room_name < b.room_name ? -1 : 1));
    globalThis.currently_selected_seating_chart = get_default_seating_chart();
    set_default_seating_chart(globalThis.currently_selected_seating_chart.ref_id);
    leftDiv.innerHTML = "";
    leftDiv.appendChild(gen_dropdown());
    leftDiv.appendChild(gen_trash());
    globalThis.roles.forEach((role) => {
      leftDiv.appendChild(gen_draggable(role));
    });
    leftDiv.style.display = "flex";
    draw_chart();
  } else {
    const mainDiv = document.getElementById("steps")! as HTMLDivElement;
    mainDiv.innerHTML = "No layouts found";
  }
  updateStatus(loadingStatus.DONE, "Ready");
}

export function draw_chart() {
  const chart = globalThis.currently_selected_seating_chart;
  const main_div = document.getElementById("steps")! as HTMLDivElement;
  const delete_div = document.getElementsByClassName("trash")[0]! as HTMLDivElement;
  const gridDiv = document.createElement("div");
  main_div.innerHTML = "";
  gridDiv.id = "seating_chart_div";
  gridDiv.classList.add("grid-stack");
  main_div.appendChild(gen_seating_chart_title());
  main_div.appendChild(gridDiv);
  main_div.appendChild(gen_save_button());
  let grid = GridStack.init({
    cellHeight: 70,
    acceptWidgets: true,
    removable: ".trash", // drag-out delete class
    float: true,
    // placeholderText: "Empty",
  });
  grid
    .on("dragstart", function (_event, el) {
      let n = el.gridstackNode;
      delete_div.style.display = "flex";
      //   console.log("dragstart");
    })
    .on("dragstop", function (_event: any, el: any) {
      let n = el.gridstackNode;
      delete_div.style.display = "none";
      //   console.log("dragstop");
      const serializedData = grid.save();
      console.log(JSON.stringify(serializedData));
    });
  GridStack.setupDragIn(".newWidget", {
    appendTo: "body",
    helper: "clone",
    // (e) => {
    //   const target = e.target! as HTMLDivElement;
    //   var innerText: string;
    //   if (target.tagName == "SPAN") {
    //     innerText = target.innerHTML;
    //   } else {
    //     innerText = (target.querySelector("span") as HTMLSpanElement).innerHTML;
    //   }
    //   const div = gen_temp_draggable(innerText);
    //   return div;
    // },
  });

  let items = JSON.parse(chart.chart);
  grid.load(items, add_remove_widget);

  grid.on("added removed change", function (e: any, items: any) {
    const serializedData = grid.save();
    if (globalThis.is_editing_mode) {
      document.getElementById("save_button")!.style.display = "block";
    } else {
      document.getElementById("save_button")!.style.display = "none";
    }
    globalThis.currently_displayed_seating_chart = JSON.stringify(serializedData);
    // console.log(JSON.stringify(serializedData));
  });
}

const add_remove_widget: AddRemoveFcn = (parent: HTMLElement, w: GridStackWidget, add: boolean, grid: boolean) => {
  const div = gen_loaded_draggable(w.content!);
  return div;
};
