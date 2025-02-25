export function fileNameFromPath(path: string) {
  return path.split("\\").pop();
}
