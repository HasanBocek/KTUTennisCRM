import type { MenuItemType } from "$lib/types/menu";

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: "general",
    label: "Genel",
    isTitle: true,
  },
  {
    key: "profile",
    icon: "iconoir-user",
    label: "Profil",
    url: "/dashboard/profile",
  },
  {
    key: "groups",
    icon: "iconoir-tennis-ball-alt",
    label: "Grup Başvurusu",
    url: "/dashboard/courses/groups",
    permission: "group:list",
  },
  {
    key: "management",
    label: "Yönetim",
    isTitle: true,
    permission: "management",
  },
  {
    key: "user-management",
    icon: "iconoir-group",
    label: "Üye Yönetimi",
    permission: "user:list",
    url: "/dashboard/management/users",
  },
  {
    key: "group-list",
    icon: "fas fa-list-ul",
    label: "Grup Yönetimi",
    url: "/dashboard/management/groups",
    permission: "group:list",
  },
  {
    key: "sessions",
    icon: "fas fa-chalkboard-teacher",
    label: "Ders Yönetimi",
    url: "/dashboard/management/sessions",
    permission: "session:list",
  },
  {
    key: "membership",
    icon: "fas fa-user-plus",
    label: "Başvuru Yönetimi",
    url: "/dashboard/management/membership",
    permission: "membership:list",
  },
];
