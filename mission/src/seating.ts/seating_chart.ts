import { GridStack } from "gridstack";
import { loadingStatus, type SeatingChart } from "../browser/types";
import { updateStatus } from "../dom/status";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { gen_draggable, gen_dropdown, gen_seating_chart_title, gen_trash } from "./web_components";

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
    globalThis.currently_selected_seating_chart = globalThis.seating_chart[0];
    leftDiv.innerHTML = "";
    leftDiv.appendChild(gen_dropdown());
    leftDiv.appendChild(gen_trash());
    leftDiv.appendChild(gen_draggable());
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
  let grid = GridStack.init({
    cellHeight: 70,
    acceptWidgets: true,
    removable: ".trash", // drag-out delete class
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
  GridStack.setupDragIn(".newWidget", { appendTo: "body", helper: "clone" });

  let items = JSON.parse(chart.chart);
  //    [
  //     { x: 2, y: 0, w: 10, noMove: true, noResize: true, locked: true, content: "Desk" },
  //     { x: 0, y: 1, w: 2, h: 4, content: "6" },
  //     { x: 2, y: 1, w: 2, h: 2, content: "8" },
  //     { x: 4, y: 1, w: 2, h: 2, content: "9" },
  //     {
  //       w: 2,
  //       h: 2,
  //       x: 6,
  //       y: 1,
  //       content: "<span>TOP: Person Name</span>",
  //     },
  //     { x: 8, y: 1, h: 2, minW: 2, noResize: true, content: "cannot resize" },
  //     { x: 10, y: 1, w: 2, h: 2, content: "4" },
  //     { x: 2, y: 3, w: 2, h: 2, content: "5" },
  //     { x: 8, y: 3, w: 2, h: 2, content: "10" },
  //     { x: 10, y: 3, w: 2, h: 2, content: "11" },
  //     { x: 8, y: 5, w: 4, h: 2, content: "7" },
  //   ];
  grid.load(items);

  grid.on("added removed change", function (e: any, items: any) {
    let str = "";
    items.forEach(function (item: any) {
      str += " (x,y)=" + item.x + "," + item.y;
    });
    console.log(e.type + " " + items.length + " items:" + str);
  });
}

//   addEvents(grid);

// 2.x method - just saving list of widgets with content (default)
//   function loadGrid() {
//     grid.load(serializedData);
//   }

//   // 2.x method
//   function saveGrid() {
//     const serializedData = grid.save();
//     document.querySelector('#saved-data').value = JSON.stringify(serializedData, null, '  ');
//   }

//   // 3.1 full method saving the grid options + children (which is recursive for nested grids)
//   function saveFullGrid() {
//     serializedFull = grid.save(true, true);
//     serializedData = serializedFull.children;
//     document.querySelector('#saved-data').value = JSON.stringify(serializedFull, null, '  ');
//   }

//   // 3.1 full method to reload from scratch - delete the grid and add it back from JSON
//   function loadFullGrid() {
//     if (!serializedFull) return;
//     grid.destroy(true); // nuke everything
//     grid = GridStack.addGrid(document.querySelector('#gridCont'), serializedFull)
//   }

//   function clearGrid() {
//     grid.removeAll();
//   }

//   function removeWidget(el) {
//     // TEST removing from DOM first like Angular/React/Vue would do
//     el.remove();
//     grid.removeWidget(el, false);
//   }

// setTimeout(() => loadGrid(), 1000); // TEST force a second load which should be no-op
