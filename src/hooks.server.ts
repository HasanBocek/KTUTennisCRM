import type { Handle } from "@sveltejs/kit";
import { env } from '$env/dynamic/public';
export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get("accessToken");
  const refreshToken = event.cookies.get("refreshToken");

  if (accessToken) {
      // backend'e session token ile isteği at
      const res = await fetch(`${env.PUBLIC_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.code === 200) {
          event.locals.user = data.data;
        } else {
          event.locals.user = null;
        }
      } else {
        event.locals.user = null; 
      }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
