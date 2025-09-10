import { env } from '$env/dynamic/public';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const accessToken = cookies.get('accessToken');
  if (!accessToken) {
    throw redirect(302, '/auth/login');
  }

  try {
    const response = await fetch(`${env.PUBLIC_BACKEND_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw error(response.status, 'Kullanıcılar getirilemedi.');
    }

    const data = await response.json();
    if (data.code !== 200) {
      throw error(500, data.message || 'Kullanıcılar getirilemedi.');
    }

    return {
      user: locals.user,
      users: data.data ?? []
    };
  } catch (err) {
    console.error('Users load error:', err);
    throw error(500, 'Kullanıcılar getirilemedi.');
  }
};


