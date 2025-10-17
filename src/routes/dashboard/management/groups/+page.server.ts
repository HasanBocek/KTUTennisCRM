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


  // Return data based on API responses
  return {
    user,
    accessToken,
    groups: groupsResult.success ? groupsResult.data ?? [] : [],
    errors: [
      ...(groupsResult.errors || [])
    ]
  };
};
