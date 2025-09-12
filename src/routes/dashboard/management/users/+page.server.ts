import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { apiGet } from "$lib/utils/api";

export const load: PageServerLoad = async ({
  locals,
  cookies,
}) => {
  if (!locals.user) {
    throw redirect(302, "/auth/login");
  }

  const accessToken = cookies.get("accessToken");
  if (!accessToken) {
    throw redirect(302, "/auth/login");
  }

  // Fetch users using the new API utility
  const usersResult = await apiGet('/user/', { accessToken });

  // Return data based on API response
  return {
    user: locals.user,
    users: usersResult.success ? usersResult.data ?? [] : [],
    errors: usersResult.errors
  };
};
