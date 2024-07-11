import { type APIRoute } from "astro";
import { clientOauth } from "@/firebase/config";
export const GET: APIRoute = async ({ params, request }) => {
    const web = clientOauth.web;

    const clientId = web.client_id;
    const clientSecret = web.client_secret;
    const redirectUri = web.redirect_uris[0];
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    console.log('code', code);
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
        return new Response(JSON.stringify({ error: tokenData.error }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json',
        }
        });
    }
    // Verify the id token
    const idToken = tokenData.id_token;
    const idTokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const idTokenData = await idTokenResponse.json();
    if (idTokenData.error) {
        return new Response(JSON.stringify({ error: idTokenData.error }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json',
        }
        });
    }
    console.log('idTokenData', idTokenData);
    return new Response(JSON.stringify(tokenData), {
        status: 200,
        headers: {
        'Content-Type': 'application/json',
        }
    });
}