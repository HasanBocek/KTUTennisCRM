import { env } from "$env/dynamic/public";
import { addToast } from "$lib/components/ToastNotification.svelte";

export interface UpdateAttendanceRequest {
  sessionId: string;
  userId: string;
  status: string;
  note?: string;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export class AttendanceService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  /**
   * Updates attendance status for a user in a specific session
   */
  static async updateAttendance(
    request: UpdateAttendanceRequest
  ): Promise<AttendanceResponse> {
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!accessToken) {
        throw new Error("Oturum açılmamış");
      }

      const response = await fetch(
        `${this.baseUrl}/session/${request.sessionId}/user/${request.userId}/attendance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            status: request.status,
            note: request.note,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.code !== 200) {
        // Show error toast

        data.errors?.forEach((error: string) => {
          addToast({
            message: error,
            type: "danger",
          });
        });

        return {
          success: false,
          message: data.message || "Katılım durumu güncellenemedi.",
          errors: data.errors || [],
        };
      }

      // Show success toast
      addToast({
        message:
          data.message || "Katılım durumu başarıyla güncellendi.",
        type: "success",
      });

      return {
        success: true,
        message:
          data.message || "Katılım durumu başarıyla güncellendi.",
        data: data.data,
      };
    } catch (error) {
      console.error("Attendance update error:", error);

      // Show network error toast
      addToast({
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        type: "danger",
      });

      return {
        success: false,
        message:
          "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.",
        errors: ["Ağ hatası veya sunucu mevcut değil"],
      };
    }
  }
}
