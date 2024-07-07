import { type APIRoute } from "astro";
import { auth } from "@/firebase/config";
export const POST: APIRoute = async({ params, request }) => { 
    if(auth.currentUser && !auth.currentUser?.isAnonymous){
        await auth.signOut();
        return new Response(JSON.stringify({
            message: 'User logged out successfully',
        }), {
            headers: { 'content-type': 'application/json' },
        });
    } 
    return new Response(JSON.stringify({
        message: 'No user logged in',
    }), {
        headers: {
            'content-type': 'application/json',
            'status': '401',
        },
    });
}