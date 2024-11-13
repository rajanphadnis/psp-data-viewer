// export async function buttonClickHandler(dataset: string) {
//   setLoadingState({ isLoading: true, statusMessage: "Plotting..." });
//   if (activeDatasets().includes(dataset)) {
//     const index = activeDatasets().indexOf(dataset, 0);
//     const currentVal = datasetsLegendSide()[index];
//     if (currentVal == sitePreferences().axesSets) {
//       const original = datasetsLegendSide();
//       original[index] = 1;
//       setDatasetsLegendSide(original);
//     } else {
//       const original = datasetsLegendSide();
//       original[index] = currentVal + 1;
//       setDatasetsLegendSide(original);
//     }
//   } else {
//     console.log("includes");
//     const newList = activeDatasets();
//     newList.push(dataset);
//     setActiveDatasets(newList);
//     console.log(activeDatasets());
//     const newLegendList = datasetsLegendSide();
//     newLegendList.push(1);
//     setDatasetsLegendSide(newLegendList);
//   }
//   // await update(testBasics().starting_timestamp!, testBasics().ending_timestamp!);
//   setLoadingState({ isLoading: false, statusMessage: "" });
// }
