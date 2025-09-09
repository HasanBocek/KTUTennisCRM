import { env } from '$env/dynamic/public';
import type { MeType } from '$lib/types/types';
import { addToast } from '$lib/components/ToastNotification.svelte';

export class ProfileService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  static async updateProfile(userData: Partial<MeType>): Promise<{ success: boolean; message: string; updatedUser?: MeType }> {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!accessToken) {
        throw new Error('Oturum açılmamış');
      }

      const response = await fetch(`${this.baseUrl}/user/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.code !== 200) {
        // Handle error response
        addToast({
          message: data.message || 'Profil güncellenemedi.',
          type: 'danger'
        });

        return {
          success: false,
          message: data.message || 'Profil güncellenemedi.'
        };
      }

      // Success toast
      addToast({
        message: data.message || 'Profil başarıyla güncellendi.',
        type: 'success'
      });

      return {
        success: true,
        message: data.message || 'Profil başarıyla güncellendi.',
        updatedUser: data.data // Assuming the backend returns the updated user data
      };
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Network error toast
      addToast({
        message: 'Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.',
        type: 'danger'
      });

      return {
        success: false,
        message: 'Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.'
      };
    }
  }
}