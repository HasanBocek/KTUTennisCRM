import { env } from "$env/dynamic/public";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  params,
  parent,
  fetch,
  cookies,
}) => {
  const { user } = await parent();
  const accessToken = cookies.get("accessToken");

  if (!accessToken) {
    throw redirect(302, "/auth/login");
  }

  if (params.id) {
    try {
      const userResponse = await fetch(
        `${env.PUBLIC_BACKEND_URL}/user/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (userResponse.status !== 200) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const sessionResponse = await fetch(
        `${env.PUBLIC_BACKEND_URL}/session/user/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (sessionResponse.status !== 200) {
        throw new Error("Session bulunamadı");
      }

      const sessions = await sessionResponse.json();

      const targetUser = await userResponse.json();

      return {
        user,
        sessions: sessions.data,
        id: params.id,
        targetUser: targetUser.data,
      };
    } catch (error) {
      console.error("Error fetching user:", error);

      return {
        user,
        sessions: [],
        id: params.id,
        targetUser: null,
        error:
          error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  return {
    user,
    sessions: [],
    id: null,
    targetUser: null,
  };
};
