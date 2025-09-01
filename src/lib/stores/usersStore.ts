import { derived, writable, get, type Writable } from "svelte/store";
import type { UserType } from "$lib/types/types";

// Central users store
export const usersStore: Writable<UserType[]> = writable<UserType[]>([]);

// Initialize/replace users
export function initializeUsers(users: UserType[]): void {
  usersStore.set([...users]);
}

// CRUD helpers
export function addUser(user: UserType): void {
  usersStore.update((list) => [user, ...list]);
}

export function updateUser(updated: UserType): void {
  usersStore.update((list) => list.map((u) => (u._id === updated._id ? { ...updated } : u)));
}

export function deleteUser(userId: string): void {
  usersStore.update((list) => list.filter((u) => u._id !== userId));
}

// Derived: only users who have the 'coach' role
export const coachesStore = derived(usersStore, ($users) =>
  $users.filter((u) => (u.roles ?? []).includes("coach"))
);

// Helper for lookups
export function getUserById(userId: string): UserType | undefined {
  const users = get(usersStore);
  return users.find((u) => u._id === userId);
}

