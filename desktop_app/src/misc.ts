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
