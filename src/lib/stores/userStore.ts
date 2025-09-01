import type { MeType } from "$lib/types/types";
import { writable } from "svelte/store";
import { MeData } from "$lib/assets/data/mock/data";

export const meStore = writable<MeType>({ ...MeData });

export async function updateMeInStore(
  updated: MeType
): Promise<MeType> {
  await new Promise((r) => setTimeout(r, 500));
  meStore.set({ ...updated });
  return updated;
}

export { MeData };
