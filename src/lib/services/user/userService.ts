import { env } from "$env/dynamic/public";
import type { UserType } from "$lib/types/types";

export class UserService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  static async updateUser(
    userId: string,
    userData: Partial<UserType>
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
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
      const response = await fetch(`${this.baseUrl}/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          isMale: userData.isMale,
          isStudent: userData.isStudent,
          phoneNumber: userData.phoneNumber,
          studentNumber: userData.studentNumber,
          department: userData.department,
          grade: userData.grade,
          skillLevel: userData.skillLevel?.toString(),
          isEmailVerified: userData.isEmailVerified,
          roles: userData.roles,
          notes: userData.notes,
        }),
        credentials: "include",
      });
      console.log(userData.isStudent);

      const data = await response.json();

      if (data.code !== 200) {
        return {
          success: false,
          message: data.message || "Kullanıcı güncellenemedi.",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message || "Kullanıcı başarıyla güncellendi.",
        user: data.data,
      };
    } catch (error) {
      console.error("User update error:", error);
      return {
        success: false,
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: [
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        ],
      };
    }
  }

  static async updateUserEmail(
    userId: string,
    email: string,
    isEmailVerified: boolean
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
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
      const response = await fetch(`${this.baseUrl}/user/${userId}/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          isEmailVerified,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.code !== 200) {
        return {
          success: false,
          message: data.message || "E-posta güncellenemedi.",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message || "E-posta başarıyla güncellendi.",
        user: data.data,
      };
    } catch (error) {
      console.error("Email update error:", error);
      return {
        success: false,
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: [
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        ],
      };
    }
  }

  static async deleteUser(
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
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
      const response = await fetch(`${this.baseUrl}/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      const data = await response.json();

      if (data.code !== 200) {
        return {
          success: false,
          message: data.message || "Kullanıcı silinemedi.",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message || "Kullanıcı başarıyla silindi.",
      };
    } catch (error) {
      console.error("User delete error:", error);
      return {
        success: false,
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: [
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        ],
      };
    }
  }

  static async createUser(
    userData: Partial<UserType>
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
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
      const response = await fetch(`${this.baseUrl}/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          isStudent: userData.isStudent,
          isMale: userData.isMale,
          phoneNumber: userData.phoneNumber,
          studentNumber: userData.studentNumber,
          department: userData.department,
          grade: userData.grade,
          skillLevel: userData.skillLevel?.toString(),
          isEmailVerified: userData.isEmailVerified,
          roles: userData.roles,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.code !== 200) {
        return {
          success: false,
          message: data.message || "Kullanıcı oluşturulamadı.",
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        message: data.message || "Kullanıcı başarıyla oluşturuldu.",
        user: data.data,
      };
    } catch (error) {
      console.error("User create error:", error);
      return {
        success: false,
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: [
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        ],
      };
    }
  }
}
