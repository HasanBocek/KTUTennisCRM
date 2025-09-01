import { writable } from 'svelte/store';
import { ROLES, type RoleType, getRoleById, getRoleNameById, getRoleColorById } from '$lib/types/role';

// Create a writable store with the static roles
export const roleStore = writable<RoleType[]>(ROLES);

// Derived stores for common operations
export const roleNames = writable<Record<string, string>>({});
export const roleColors = writable<Record<string, string>>({});

// Initialize the derived stores
ROLES.forEach(role => {
    roleNames.update(names => ({ ...names, [role.id]: role.name }));
    roleColors.update(colors => ({ ...colors, [role.id]: role.color }));
});

// Helper functions that work with the store
export function getRoleFromStore(id: string): RoleType | undefined {
    let roles: RoleType[] = [];
    roleStore.subscribe(value => roles = value)();
    return roles.find(role => role.id === id);
}

export function getRoleNameFromStore(id: string): string {
    let names: Record<string, string> = {};
    roleNames.subscribe(value => names = value)();
    return names[id] || id;
}

export function getRoleColorFromStore(id: string): string {
    let colors: Record<string, string> = {};
    roleColors.subscribe(value => colors = value)();
    return colors[id] || "#6c757d";
}

// Export the static helper functions as well
export { getRoleById, getRoleNameById, getRoleColorById }; 