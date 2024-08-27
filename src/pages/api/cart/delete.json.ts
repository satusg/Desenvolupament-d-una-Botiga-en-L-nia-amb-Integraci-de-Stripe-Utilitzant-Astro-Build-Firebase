import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";
import { getTotal } from "@/utils/cart";

export const POST: APIRoute = async ({ params, request }) => {
  const user = await authenticateForCart();
  const requestBody = await request.json();
  const { product, quantity, all } = requestBody;

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
          message: "Cart not found",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }
    if (all === true) {
      await cartRef.delete();
      return new Response(
        JSON.stringify({
          message: "Cart deleted successfully",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }
    // Obtener los datos del carrito
    const cartData = doc.data();
    if (!cartData) {
      return new Response(
        JSON.stringify({
          message: "Cart is empty",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }
    // Verificar si el producto existe en el carrito
    if (!cartData?.products?.[product.id]) {
      return new Response(
        JSON.stringify({
          message: "Product not found in cart",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }
    // recalculate the total
    // Actualizar la cantidad del producto
    if (cartData.products[product.id].quantity - quantity <= 0) {
      delete cartData.products[product.id];
    } else {
      cartData.products[product.id].quantity -= quantity;
    }
    const productsCartData = cartData.products;
    const total = getTotal(productsCartData);
    // Actualizar el carrito en Firestore
    await cartRef.set({
      productsCartData,
      total,
    });

    return new Response(
      JSON.stringify({
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
        currentUser: user?.uid || "No user",
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
