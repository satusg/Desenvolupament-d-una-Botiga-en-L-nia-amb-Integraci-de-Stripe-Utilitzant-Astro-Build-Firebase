import { type APIRoute } from "astro";
import { clientOauth } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const web = clientOauth.web;
    const clientId = web.client_id;
    const clientSecret = web.client_secret;
    const redirectUri = web.redirect_uris[0];
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const idToken = tokenData.id_token;
    const credential = GoogleAuthProvider.credential(idToken);
    const firebaseUser = await signInWithCredential(auth, credential);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account",
      },
    });
  } catch (error) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account",
      },
    });
  }
};
