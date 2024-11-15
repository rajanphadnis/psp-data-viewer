export function downloadCSV(datasets: string[], start: number, end: number) {
  const data_columns = JSON.parse(localStorage.getItem("currentData_data")!);
  const data_names = JSON.parse(localStorage.getItem("currentData_names")!);
  if (data_columns.length == 0) {
    alert("No data to donwload");
    // return;
  }
  let csvData: any[][] = [[...data_names]];
  for (let i = 0; i < data_columns[0].length; i++) {
    let rowToWrite = [];
    for (let j = 0; j < data_columns.length; j++) {
      const element = data_columns[j][i];
      rowToWrite.push(element);
    }
    csvData.push(rowToWrite);
  }
  let csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${datasets.join(" ")} ${start} ${end}.csv`);
  document.body.appendChild(link);
  link.click();
}
