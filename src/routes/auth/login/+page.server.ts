import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  if (locals.user) {
    throw redirect(302, '/dashboard/profile');
  }

  return {
    user: locals.user
  };
}