import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { apiGet } from "$lib/utils/api";

export const load: PageServerLoad = async ({
  parent,
  cookies,
}) => {
  const { user } = await parent();
  const accessToken = cookies.get("accessToken");

  if (!accessToken) {
    throw redirect(302, "/auth/login");
  }

  // Fetch groups
  const groupsResult = await apiGet('/group/', { accessToken });

  // Fetch users (to get coaches)
  const usersResult = await apiGet('/user/', { accessToken });

  // Return data based on API responses
  return {
    user,
    groups: groupsResult.success ? groupsResult.data ?? [] : [],
    coaches: usersResult.success 
      ? (usersResult.data?.filter((user: any) => user.role === "coach") ?? [])
      : [],
    errors: [
      ...(groupsResult.errors || []),
      ...(usersResult.errors || [])
    ]
  };
};
