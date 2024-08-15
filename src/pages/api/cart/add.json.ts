import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

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
    let total = 0;

    for (const key in cartData) {
      if (key !== "total") {
        const item = cartData[key];
        total += item.price * item.quantity;
        console.log(item.price, item.quantity);
      }
    }
    console.log(total);
    await cartRef.set(
      {
        products: {
          [product.id]: {
            ...product,
            quantity,
          },
        },
        total: total + product.price * quantity,
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
