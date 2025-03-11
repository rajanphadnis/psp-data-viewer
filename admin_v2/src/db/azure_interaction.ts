import { httpsCallable } from "firebase/functions";

export async function runRequest(is_fetch: boolean, newCount: number = 0, slug: string): Promise<string> {
  if (is_fetch) {
    const addMessage = httpsCallable(globalThis.functions, "get_api_instance_count");
    const result = await addMessage({ slug: slug });
    return JSON.stringify((result.data as any)["result"], null, 4);
  } else {
    const addMessage = httpsCallable(globalThis.functions, "update_api_instance_count");
    const result = await addMessage({ slug: slug, instances: newCount });
    return result.data as string;
  }
}
