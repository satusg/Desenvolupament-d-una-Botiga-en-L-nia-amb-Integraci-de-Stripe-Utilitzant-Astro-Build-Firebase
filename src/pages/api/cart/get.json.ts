import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

export const GET: APIRoute = async ({ params, request }) => {
  if (getCurrentUser() === null) {
    return new Response(JSON.stringify({ products: {} }), {
      headers: { "content-type": "application/json" },
    });
  }
  const user = await authenticateForCart();
  try {
    if (user?.uid === null || user?.uid === undefined) {
      throw new Error("User has not been authenticated");
    }

    const cartRef = admin.firestore().collection("carts").doc(`${user.uid}`);

    // Check if the document exists, create if not
    const doc = await cartRef.get();
    if (!doc.exists) {
      return new Response(JSON.stringify({ products: {}, total: 0 }), {
        headers: { "content-type": "application/json" },
      });
    }
    const products = doc.data().products;
    const total = doc.data().total;

    return new Response(
      JSON.stringify({
        products,
        total,
        message: "Products retrived from the cart successfully",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        currentUser: user,
        message: "Error retriving products from the cart",
        error: e.message,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
