import { MENU_ITEMS } from "$lib/assets/data/menu-items";
import type { MenuItemType } from "$lib/types/menu";

export const getMenuItems = () => {
  return MENU_ITEMS;
};

export const findAllParent = (
  menuItems: MenuItemType[],
  menuItem: MenuItemType,
): string[] => {
  let parents: string[] = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};

export const getMenuItemFromURL = (
  items: MenuItemType | MenuItemType[],
  url: string,
): MenuItemType | undefined => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};

export const findMenuItem = (
  menuItems: MenuItemType[] | undefined,
  menuItemKey: MenuItemType["key"] | undefined,
): MenuItemType | null => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export const filterMenuByPermissions = (
  menu: MenuItemType[],
  perms: string[] | Set<string>,
): MenuItemType[] => {
  const permissionSet = perms instanceof Set ? perms : new Set(perms);

  return menu.reduce<MenuItemType[]>((acc, item) => {
    const hasAccess = true; // item.permission || permissionSet.has(item.permission);

    // ── Item with children ────────────────────────────────
    if (item.children) {
      const filteredChildren = filterMenuByPermissions(
        item.children,
        permissionSet,
      );

      // Show the parent section only if:
      //   • the user has access to the parent itself
      //   • AND at least one child is visible
      if (hasAccess && filteredChildren.length) {
        acc.push({ ...item, children: filteredChildren });
      }
      // If you want parents to appear even when all children are hidden,
      // drop “&& filteredChildren.length” above.
      return acc;
    }

    // ── Leaf item ─────────────────────────────────────────
    if (hasAccess) acc.push(item);
    return acc;
  }, []);
};
