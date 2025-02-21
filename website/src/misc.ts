function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatName(str: string) {
  const trimmed = str.trim();
  return capitalizeWords(trimmed);
}


export const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));