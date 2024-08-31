import { type APIRoute } from "astro";
import { auth } from "@/firebase/config";

export const POST: APIRoute = async ({ params, request }) => {
  if (await signOut()) {
    return new Response(
      JSON.stringify({
        message: "User logged out successfully",
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  }
  return new Response(
    JSON.stringify({
      message: "No user logged in",
    }),
    {
      headers: {
        "content-type": "application/json",
        status: "401",
      },
    }
  );
};
export const GET: APIRoute = async ({ params, request }) => {
  await signOut();
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
};
const signOut = async () => {
  if (auth.currentUser && !auth.currentUser?.isAnonymous) {
    await auth.signOut();
    return true;
  }
};
