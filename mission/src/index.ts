import { Firestore, type Unsubscribe } from "firebase/firestore";
import { initFirebase } from "./init/firebase_init";
import { type ProcedureStep, type RoleAssignments, type SeatingChart } from "./browser/types";
import { initGlobalVars, initModal, initNavbar } from "./init/init";
import { login } from "./browser/login";
import type { Auth } from "firebase/auth";
import { procs } from "./procs/procs";
import { browser_checks } from "./browser/browser_interactions";
import { home } from "./home/home";
import { seating } from "./seating.ts/seating";

declare global {
  var db: Firestore;
  var steps_unsub: Unsubscribe;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var visible_procs: number[];
  var general_unsub: Unsubscribe;
  var steps: ProcedureStep[];
  var step_titles: { [index: number]: string };
  var mission_name: string;
  var mission_id: string;
  var auth: Auth;
  var is_authenticated: boolean;
  var is_editing_mode: boolean;
  var role_search: string;
  var seating_unsub: Unsubscribe;
  var seating_chart: SeatingChart[];
  var currently_selected_seating_chart: SeatingChart;
  var roles: RoleAssignments[];
  var currently_displayed_seating_chart: string;
}

initGlobalVars();
initFirebase();
login();
initNavbar();
browser_checks();
initModal();

if (location.pathname.includes("/procs/")) {
  procs();
} else {
  if (location.pathname.includes("/seating/")) {
    seating();
  } else {
    if (location.pathname.includes("/login/")) {
      login();
    } else {
      home();
    }
  }
}
