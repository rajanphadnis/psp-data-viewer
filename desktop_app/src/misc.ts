import { DateTime } from "luxon";
import { Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { CompilingStatus, CsvFile, LoadingStatus, SelectedFile } from "./types";

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

export function parseDate(name: string) {
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

export function collectChannelButtonInfo(
  files: {
    files: SelectedFile[];
  },
  channel_name: string
): [string, string][] {
  let buttonsToUpdate: [string, string][] = [];
  for (let f = 0; f < files.files.length; f++) {
    const file = files.files[f];
    for (let g = 0; g < file.groups.length; g++) {
      const group = file.groups[g];
      for (let c = 0; c < group.channels.filter((chan) => chan.channel_name == channel_name).length; c++) {
        buttonsToUpdate.push([file.path, group.group_name]);
      }
    }
  }
  return buttonsToUpdate;
}

export function processLogMessage(
  files: {
    files: SelectedFile[];
  },
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  message: string,
  setCompileStatus: Setter<CompilingStatus>,
  setCsv: SetStoreFunction<CsvFile[]>
) {
  if (message.startsWith("read::start::")) {
    const channel_name = message.replace("read::start::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.LOADING
      );
    }
  }
  if (message.startsWith("read::loaded::")) {
    const channel_name = message.replace("read::loaded::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.LOADED
      );
    }
  }
  if (message.startsWith("read::complete::")) {
    const channel_name = message.replace("read::complete::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.LOADED
      );
    }
  }
  if (message.startsWith("stack::start")) {
    setCompileStatus(CompilingStatus.FLATTENING);
  }
  if (message.startsWith("calc::start")) {
    setCompileStatus(CompilingStatus.APPLYING_CALCS);
    const channel_name = message.replace("calc::start::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.CALC
      );
    }
  }
  if (message.startsWith("resize::start")) {
    setCompileStatus(CompilingStatus.RESIZING);
    const channel_name = message.replace("resize::start::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.RESIZE
      );
    }
  }
  if (message.startsWith("resize::complete")) {
    setCompileStatus(CompilingStatus.RESIZING);
    const channel_name = message.replace("resize::complete::", "");
    const buttonsToUpdate = collectChannelButtonInfo(files, channel_name);
    for (let b = 0; b < buttonsToUpdate.length; b++) {
      const buttonToUpdate = buttonsToUpdate[b];
      setFiles(
        "files",
        (file_filter) => file_filter.path == buttonToUpdate[0],
        "groups",
        (group_filter) => group_filter.group_name == buttonToUpdate[1],
        "channels",
        (channel_filter) => channel_filter.channel_name == channel_name,
        "state",
        LoadingStatus.FINISHED
      );
    }
  }
  if (message.startsWith("save::start")) {
    setCompileStatus(CompilingStatus.SAVING);
  }
  if (message.startsWith("csv_gather::start::")) {
    setCompileStatus(CompilingStatus.FLATTENING);
    const file_path = message.replace("csv_gather::start::", "");
    setCsv(
      (file) => file.file_path == file_path,
      "state",
      LoadingStatus.LOADING
    );
  }
  if (message.startsWith("csv_gather::complete::")) {
    // setCompileStatus(CompilingStatus.RESIZING);
    const file_path = message.replace("csv_gather::complete::", "");
    setCsv(
      (file) => file.file_path == file_path,
      "state",
      LoadingStatus.LOADED
    );
  }
  if (message.startsWith("csv_resize::start::")) {
    setCompileStatus(CompilingStatus.RESIZING);
    const file_path = message.replace("csv_resize::start::", "");
    setCsv(
      (file) => file.file_path == file_path,
      "state",
      LoadingStatus.RESIZE
    );
  }
  if (message.startsWith("csv_resize::complete::")) {
    // setCompileStatus(CompilingStatus.SAVING);
    const file_path = message.replace("csv_resize::complete::", "");
    setCsv(
      (file) => file.file_path == file_path,
      "state",
      LoadingStatus.FINISHED
    );
  }
}
