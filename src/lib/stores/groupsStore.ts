import { writable, type Writable } from "svelte/store";
import type { GroupType } from "$lib/types/types";

export const groupsStore: Writable<GroupType[]> = writable<GroupType[]>([]);

export function initializeGroups(groups: GroupType[]): void {
  groupsStore.set([...groups]);
}

export function addGroup(group: GroupType): void {
  groupsStore.update((list) => [group, ...list]);
}

export function updateGroup(updated: GroupType): void {
  groupsStore.update((list) => list.map((g) => (g._id === updated._id ? { ...updated } : g)));
}

export function deleteGroup(groupId: string): void {
  groupsStore.update((list) => list.filter((g) => g._id !== groupId));
}

export function getGroupById(groupId: string): GroupType | undefined {
  let found: GroupType | undefined;
  groupsStore.subscribe((list) => {
    found = list.find((g) => g._id === groupId);
  })();
  return found;
}

