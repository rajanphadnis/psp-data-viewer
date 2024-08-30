import { clearDatums } from "../tools/measuring";
import { toggleMeasuringModal } from "../modals/measuringModal";
import { toggleSettingsModal } from "../modals/settingsModal";
import { toggleSwitcherModal } from "../modals/testSwitcherModal";

export function addKeyPressListeners() {
  document.onkeydown = (e) => {
    if (e.key == "Escape") {
      clearDatums(globalThis.uplot);
    }
    if (e.key == "e") {
      toggleMeasuringModal();
    } 
    if (e.key == "s") {
      toggleSettingsModal();
    }
    if (e.key == "t") {
      toggleSwitcherModal();
    }
    else {
      const { left, top } = globalThis.uplot.cursor;

      if (left && top && left >= 0 && top >= 0) {
        if (e.key == "1") {
          globalThis.x1 = globalThis.uplot.posToVal(left, "x");
          globalThis.y1 = [];
          globalThis.plotDisplayedAxes.forEach((scale) => {
            globalThis.y1.push(globalThis.uplot.posToVal(top, scale));
          });
          globalThis.uplot.redraw();
        } else if (e.key == "2") {
          globalThis.x2 = globalThis.uplot.posToVal(left, "x");
          globalThis.y2 = [];
          globalThis.plotDisplayedAxes.forEach((scale) => {
            globalThis.y2.push(globalThis.uplot.posToVal(top, scale));
          });
          globalThis.uplot.redraw();
        }
      }
    }
  };
}
