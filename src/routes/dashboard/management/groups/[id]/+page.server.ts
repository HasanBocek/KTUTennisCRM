import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { apiGet } from "$lib/utils/api";

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  const { user } = await parent();
  const accessToken = cookies.get("accessToken");

  // If group ID is provided, find the specific group
  if (params.id) {
    const groupsResult = await apiGet("/group/" + params.id, {
      accessToken,
    });

    // Check if the result is a single group object or an array
    const group = groupsResult.success
      ? (Array.isArray(groupsResult.data) 
          ? groupsResult.data.find((g: any) => g._id === params.id) 
          : (groupsResult.data?._id === params.id ? groupsResult.data : null))
      : null;

    return {
      user,
      id: params.id,
      group,
      groups: groupsResult.success 
        ? (Array.isArray(groupsResult.data) ? groupsResult.data : [groupsResult.data]).filter(Boolean)
        : [],
      errors: groupsResult.errors || [],
    };
  }

  // Fetch all groups if no specific ID
  const groupsResult = await apiGet("/group/", { accessToken });

  // Return all groups
  return {
    user,
    id: null,
    group: null,
    groups: groupsResult.success 
      ? (Array.isArray(groupsResult.data) ? groupsResult.data : [groupsResult.data]).filter(Boolean)
      : [],
    errors: groupsResult.errors || [],
  };
};
