export interface RoleType {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  level: number;
  isDefault?: boolean;
}

export const ROLES: RoleType[] = [
  {
    id: "president",
    name: "Kulüp Başkanı",
    description: "Kulübün tüm faaliyetlerini yöneten en üst düzey yönetici.",
    color: "#D32F2F",
    permissions: [
      "user.create",
      "user.list",
      "user.get",
      "user.update",
      "user.delete",
      "user.update-email",
      "user.password-reset",
      "group.create",
      "group.list",
      "group.get",
      "group.update",
      "group.delete",
      "membership.approve",
      "membership.approvePayment",
      "membership.reject",
      "membership.create",
      "membership.list",
      "membership.get",
      "membership.delete",
      "session.create",
      "session.list",
      "session.get",
      "session.update",
      "session.delete",
      "log.view",
      "log.create",
      "log.update",
      "log.delete",
    ],
    level: 5,
  },
  {
    id: "vicepresident",
    name: "Başkan Yardımcısı",
    description: "Kulüp başkanına yardım eden ve gerektiğinde yetkilerini kullanan yardımcı.",
    color: "#1976D2",
    permissions: [
      "user.create",
      "user.list",
      "user.get",
      "user.update",
      "user.delete",
      "user.update-email",
      "user.password-reset",
      "group.create",
      "group.list",
      "group.get",
      "group.update",
      "group.delete",
      "membership.approve",
      "membership.approvePayment",
      "membership.reject",
      "membership.create",
      "membership.list",
      "membership.get",
      "membership.delete",
      "session.create",
      "session.list",
      "session.get",
      "session.update",
      "session.delete",
      "log.view",
      "log.create",
      "log.update",
      "log.delete",
    ],
    level: 4,
  },
  {
    id: "boardmember",
    name: "Yönetim Kurulu Üyesi",
    description: "Kulübün yönetim kararlarında söz sahibi olan kurul üyesi.",
    color: "#388E3C",
    permissions: [
      "user.create",
      "user.list",
      "user.get",
      "user.update",
      "user.delete",
      "user.update-email",
      "user.password-reset",
      "group.create",
      "group.list",
      "group.get",
      "group.update",
      "group.delete",
      "membership.approve",
      "membership.approvePayment",
      "membership.reject",
      "membership.create",
      "membership.list",
      "membership.get",
      "membership.delete",
      "session.create",
      "session.list",
      "session.get",
      "session.update",
      "session.delete",
      "log.view",
      "log.create",
      "log.update",
      "log.delete",
    ],
    level: 3,
  },
  {
    id: "coach",
    name: "Antrenör",
    description: "Grup dersleri veren profesyonel tenis antrenörü.",
    color: "#FBC02D",
    permissions: [
      "user.create",
      "user.list",
      "user.get",
      "user.update",
      "user.delete",
      "user.update-email",
      "user.password-reset",
      "membership.approve",
      "membership.approvePayment",
      "membership.reject",
      "membership.create",
      "membership.list",
      "membership.get",
      "membership.delete",
      "session.create",
      "session.list",
      "session.get",
      "session.update",
      "session.delete",
      "log.view",
      "log.create",
      "log.update",
      "log.delete",
    ],
    level: 2,
  },
  {     
    id: "member",
    name: "Üye",
    description: "Kulübün etkinliklerine katılabilen standart üye.",
    color: "#2196F3",
    permissions: [],
    level: 1,
    isDefault: true,
  },
];

// Helper function to get role by ID
export function getRoleById(id: string): RoleType | undefined {
  return ROLES.find(role => role.id === id);
}

// Helper function to get role name by ID
export function getRoleNameById(id: string): string {
  const role = getRoleById(id);
  return role ? role.name : id;
}

// Helper function to get role color by ID
export function getRoleColorById(id: string): string {
  const role = getRoleById(id);
  return role ? role.color : "#6c757d";
} 