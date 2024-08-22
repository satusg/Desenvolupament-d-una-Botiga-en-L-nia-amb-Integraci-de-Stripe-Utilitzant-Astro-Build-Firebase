import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";
import { getTotal } from "@/utils/cart";
export const POST: APIRoute = async ({ params, request }) => {
  const user = await authenticateForCart();
  const requestBody = await request.json();
  const { product, quantity } = requestBody;

  try {
    if (user?.uid === null || user?.uid === undefined) {
      throw new Error("User has not been authenticated");
    }

    const cartRef = admin.firestore().collection("carts").doc(`${user.uid}`);

    const doc = await cartRef.get();
    if (!doc.exists) {
      await cartRef.set({});
    }

    const cartData = doc.data();
    const products = cartData?.products || {};
    const total = getTotal(products);
    await cartRef.set(
      {
        products: {
          [product.id]: {
            ...product,
            quantity,
          },
        },
        total: total,
      },
      { merge: true }
    );

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
