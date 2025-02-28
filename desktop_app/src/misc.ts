import { DateTime } from "luxon";

export function fileNameFromPath(path: string) {
  return path.split("\\").pop();
}

export function readString(data: string | undefined) {
  if (data == undefined) {
    return undefined;
  } else {
    if (data == "") {
      return undefined;
    } else {
      return data;
    }
  }
}

export function readFloat(data: string | undefined) {
  if (data == undefined) {
    return undefined;
  } else {
    if (data == "") {
      return undefined;
    } else {
      return parseFloat(data);
    }
  }
}

export function disableRefresh() {
  document.addEventListener("keydown", function (event) {
    // Prevent F5 or Ctrl+R (Windows/Linux) and Command+R (Mac) from refreshing the page
    if (event.key === "F5" || (event.ctrlKey && event.key === "r") || (event.metaKey && event.key === "r")) {
      event.preventDefault();
    }
  });

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
}

export function parseHz(group_name: string) {
  const toReturn = group_name.match(/([0-9]{1,}(.[0-9]{1,})?) Hz/);
  if (toReturn == null) {
    alert("no data frequency detected - assuming 1000 Hz");
    return parseFloat("1000");
  } else {
    return parseFloat(toReturn[0].slice(0, -3));
  }
}

export function parseDate(name: string, file_path: string) {
  // DataLog_2024-0501-0002-02_CMS_Data_Wiring_6
  if (name.startsWith("DataLog_")) {
    const date_string = name.slice(8, 25);
    const year = date_string.slice(0, 4);
    const month = date_string.slice(5, 7);
    const day = date_string.slice(7, 9);
    const hour = date_string.slice(10, 12);
    const min = date_string.slice(12, 14);
    const sec = date_string.slice(15, 17);
    const date_formatted = `${year}-${month}-${day}T${hour}:${min}:${sec}.000`;
    const date = DateTime.fromISO(date_formatted);
    return date.toMillis();
  } else {
    return 0;
  }
}
