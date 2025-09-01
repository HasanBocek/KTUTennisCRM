export async function handle({ event, resolve }) {

  /*if (!user && url.pathname !== "/auth/login") {
    return Response.redirect(new URL("/auth/login", url));
    }*/
  return resolve(event);
}
