import { env } from "$env/dynamic/public";
import type { GroupType } from "$lib/types/types";

export class GroupService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  static async createGroup(
    groupData: Partial<GroupType>
  ): Promise<{
    success: boolean;
    message: string;
    group?: any;
    errors?: string[];
  }> {
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!accessToken) {
        throw new Error("Oturum açılmamış");
      }

      const response = await fetch(`${this.baseUrl}/group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          coaches: groupData.coaches,
          schedule: groupData.schedule,
          maxMembers: groupData.maxMembers,
          membershipOpen: groupData.membershipOpen,
          payment: groupData.payment,
          notes: groupData.notes,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.code !== 200) {
        return {
          success: false,
          message: data.message || "Grup oluşturulamadı.",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message || "Grup başarıyla oluşturuldu.",
        group: data.data?.group,
      };
    } catch (error) {
      console.error("Group create error:", error);
      return {
        success: false,
        message: "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: [
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        ],
      };
    }
  }
}
