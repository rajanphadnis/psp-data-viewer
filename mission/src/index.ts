import { Firestore, type Unsubscribe } from "firebase/firestore";
import { initFirebase } from "./init/firebase_init";
import { type ProcedureStep, type RoleAssignments, type Roster, type SeatingChart } from "./browser/types";
import { initGlobalVars, initConfirmationModal, initNavbar, initRosterModal } from "./init/init";
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
  var roster: Roster[];
  var currently_displayed_seating_chart: string;
  var procs_update_queue: string[];
}

async function run() {
  initGlobalVars();
  await initFirebase();
  login();
  initNavbar();
  browser_checks();
  initConfirmationModal();
  initRosterModal();

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
}

run();
