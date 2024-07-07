import { type APIRoute } from "astro";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
export const POST: APIRoute = async ({ params, request }) => {
    const body = await request.formData();
    const email = body.get('email') as string;
    const password = body.get('password') as string;
    const validity = checkValidity();
    if (validity) return validity;
    /**
     * Function used to validate whether the email and password, name are present in the request body
     * In case of error it will return a response with the error message and the field that caused the error so it can be handled by the client.
     */
    function checkValidity(): Response | null{
        let response = null;
        if (!email) {
            response = {
                error: {
                    message: 'Email is required',
                    field: 'email',
                },
            };
        }
        if (!password) {
            response = {
                error: {
                    message: 'Password is required',
                    field: 'password',
                },
            };
        }
        if (response) { 
            return new Response(JSON.stringify(response), {
                headers: { 'content-type': 'application/json' },
            });
        }
        return null;
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully', JSON.stringify(userCredential));
        return new Response(JSON.stringify({
            message: 'User logged in successfully',
            user: {
                email: userCredential.user.email,
                name: userCredential.user.displayName,
            },
        }), {
            headers: { 'content-type': 'application/json' },
        });
    } catch ( error) { 
        if (error.code === 'auth/user-not-found') { 
            // with redirection to the login page
            return new Response(JSON.stringify({
                error: {
                    message: 'User not found. Please register first.',
                    field: 'email',
                },
            }), {
                headers: { 'content-type': 'application/json' },
            });
        } else if (error.code === 'auth/wrong-password') {
            return new Response(JSON.stringify({
                error: {
                    message: 'Invalid password. Please try again.',
                    field: 'password',
                },
            }), {
                headers: { 'content-type': 'application/json' },
            });
        } else if (error.code === 'auth/too-many-requests') {
            return new Response(JSON.stringify({
                error: {
                    message: 'Too many requests. Please try again later.'
                },
            }), {
                headers: { 'content-type': 'application/json' },
            });
        }
        console.log(error);
        return new Response(JSON.stringify({
            error: {
                message: 'Something went wrong during registration. Please try again later.',
                field: 'all',
            },
        }), {
            headers: { 'content-type': 'application/json' },
        });
    }
}