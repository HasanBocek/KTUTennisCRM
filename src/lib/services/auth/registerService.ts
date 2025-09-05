import { env } from '$env/dynamic/public';
import type { RegisterCredentials, RegisterResponse } from '$lib/types/types';

export class RegisterService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Kayıt işlemi başarısız oldu.',
          errors: data.errors || ['Bilinmeyen bir hata oluştu']
        };
      }

      return {
        success: true,
        message: data.message || 'Kayıt başarılı',
        userId: data.data?.userId
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.',
        errors: ['Ağ hatası veya sunucu mevcut değil']
      };
    }
  }
}
