export async function runRequest(is_fetch: boolean, newCount: number = 0): Promise<string> {
  if (is_fetch) {
    const url = "https://getapiconfig-w547ikcrwa-uc.a.run.app/";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json())["result"];
    return JSON.stringify(result, null, 4);
  } else {
    const url = `https://updateapiinstances-w547ikcrwa-uc.a.run.app?instances=${newCount}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return JSON.stringify(result, null, 4);
  }
}
