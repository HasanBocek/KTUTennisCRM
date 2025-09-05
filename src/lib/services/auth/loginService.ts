import type { LoginCredentials, LoginResponse } from '$lib/types/types';
import { env } from '$env/dynamic/public';

export class LoginService {
  private static baseUrl = env.PUBLIC_BACKEND_URL;

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.code !== 200 || (data.errors && data.errors.length > 0)) {
        return {
          success: false,
          message: data.message,
          errors: data.errors || ['Bilinmeyen bir hata oluştu'],
        };
      }

      // Set cookies for access and refresh tokens
      if (data.data && data.data.tokens) {
        const { access, refresh } = data.data.tokens;
        
        // Note: In a real-world scenario, you'd use server-side cookie setting
        // This is a client-side approximation
        document.cookie = `accessToken=${access.token}; path=/; max-age=${this.getMaxAge(access.expires)}; SameSite=Strict`;
        document.cookie = `refreshToken=${refresh.token}; path=/; max-age=${this.getMaxAge(refresh.expires)}; SameSite=Strict`;
      }

      return {
        success: true,
        message: data.message,
        tokens: data.data.tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        errors: ['Ağ hatası veya sunucu mevcut değil'],
      };
    }
  }

  // Helper method to calculate max-age for cookies
  private static getMaxAge(expiresAt: string): number {
    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();
    return Math.floor((expirationDate.getTime() - currentDate.getTime()) / 1000);
  }
}
