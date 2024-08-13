import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

export const POST: APIRoute = async ({ params, request }) => {
  const user = await authenticateForCart();
  const requestBody = await request.json();
  const { product, quantity } = requestBody;

  try {
    // Verificación de autenticación del usuario
    if (!user || !user.uid) {
      throw new Error("User has not been authenticated");
    }

    const cartRef = admin.firestore().collection("carts").doc(user.uid);

    // Obtener el documento del carrito
    const doc = await cartRef.get();
    if (!doc.exists) {
      return new Response(
        JSON.stringify({
          currentUser: user,
          request: requestBody,
          message: "Cart not found",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Obtener los datos del carrito
    const cartData = doc.data();

    // Verificar si el producto existe en el carrito
    if (!cartData || !cartData[product.id]) {
      return new Response(
        JSON.stringify({
          currentUser: user,
          request: requestBody,
          message: "Product not found in cart",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Manejo de la cantidad del producto

    if (cartData[product.id].quantity - quantity <= 0) {
      delete cartData[product.id];
    } else {
      cartData[product.id].quantity -= quantity;
    }

    // Actualizar el carrito en Firestore
    await cartRef.set(cartData);

    return new Response(
      JSON.stringify({
        currentUser: user,
        request: requestBody,
        message:
          quantity <= 0
            ? "Product removed from the cart successfully"
            : "Product quantity updated successfully",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    console.error(
      "Error updating cart for user:",
      user?.uid,
      "Error:",
      e.message
    );
    return new Response(
      JSON.stringify({
        currentUser: user,
        request: requestBody,
        message: "Error updating the cart",
        error: e.message,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
