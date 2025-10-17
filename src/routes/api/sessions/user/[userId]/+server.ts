import { env } from "$env/dynamic/public";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, cookies }) => {
  const accessToken = cookies.get("accessToken");
  
  if (!accessToken) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${env.PUBLIC_BACKEND_URL}/session/user/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
};






