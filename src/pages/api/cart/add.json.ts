import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(
    JSON.stringify({
      currentUser: getCurrentUser(),
      message: "User logged out successfully",
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
export const POST: APIRoute = async ({ params, request }) => {
  const user = await authenticateForCart();
  const requestBody = await request.json();
  const { product, quantity } = requestBody;
  try {
    if (user?.uid === null || user?.uid === undefined) {
      throw new Error("User has not been authenticated");
    }

    const cartRef = admin.firestore().collection("carts").doc(`${user.uid}`);

    // Check if the document exists, create if not
    const doc = await cartRef.get();
    if (!doc.exists) {
      await cartRef.set({}); // Initialize with an empty object or default values
    }

    await cartRef.set(
      {
        [product.id]: {
          ...product,
          quantity,
        },
      },
      { merge: true }
    ); // Utiliza merge para actualizar solo los campos específicos

    return new Response(
      JSON.stringify({
        currentUser: user,
        request: requestBody,
        message: "Product added to cart successfully",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        currentUser: user,
        request: requestBody,
        message: "Error adding product to cart",
        error: e.message,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
