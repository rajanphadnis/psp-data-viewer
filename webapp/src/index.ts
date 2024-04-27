import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  doc,
  getDoc,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import uPlot, { pxRatio, type AlignedData } from "uplot";

let pspColors = {
  "night-sky": "#252526",
  rush: "#DAAA00",
  moondust: "#F2EFE9",
  "bm-gold": "#CFB991",
  aged: "#8E6F3E",
  field: "#DDB945",
  dust: "#EBD99F",
  steel: "#555960",
  "cool-gray": "#6F727B",
};

async function main() {
  const firebaseConfig = {
    apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
    authDomain: "psp-portfolio-f1205.firebaseapp.com",
    projectId: "psp-portfolio-f1205",
    storageBucket: "psp-portfolio-f1205.appspot.com",
    messagingSenderId: "493859450932",
    appId: "1:493859450932:web:e4e3c67f0f46316c555a61",
  };

  const app = initializeApp(firebaseConfig);
  const db: Firestore = initializeFirestore(app, {
    localCache: persistentLocalCache(/*settings*/ { tabManager: persistentMultipleTabManager() }),
  });
  const docRef = doc(db, "short-duration-hotfire-1", "pt-ox-02");
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data()!;
  const time = docData["time"];
  const data = docData["data"];
  console.log("done");
  plot(time, data);
}

function roundData(val: any, suffix: string, precision: number = 2) {
  if (val == null || val == undefined || val == "null") {
    return "no data";
  } else {
    return val.toFixed(precision) + suffix;
  }
}

function plot(time: number[], data: number[]) {
  let toPlot: AlignedData = [time, data];
  let opts = {
    ...getSize(),
    series: [
      {},
      {
        label: "pt-ox-202",
        value: (self: any, rawValue: number) => roundData(rawValue, " psi"),
        stroke: "red",
        width: 2,
        scale: "psi",
        spanGaps: true,
      },
    ],
    axes: [
      {
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
      {
        scale: "psi",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "psi"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
    ],
    // scales: {
    //   x: {
    //     time: true,
    //   },
    //   y: {
    //     auto: true,
    //     // range: [-1.5, 1.5],
    //   },
    // }
  };

  let uplot = new uPlot(opts, toPlot, document.body);
  window.addEventListener("resize", (e) => {
    uplot.setSize(getSize());
  });
}

function getSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight - 150,
  };
}

main();
