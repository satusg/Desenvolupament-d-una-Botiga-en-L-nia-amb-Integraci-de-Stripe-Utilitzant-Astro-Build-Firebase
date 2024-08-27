import type { APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

// Respuesta estándar para usuarios no autenticados
const notAuthenticatedResponse = new Response(
  JSON.stringify({ error: "User has not been authenticated" }),
  {
    status: 401,
    headers: { "content-type": "application/json" },
  }
);

export const POST: APIRoute = async ({ request }) => {
  // Verificar autenticación del usuario
  const user = await authenticateForCart();
  if (!user?.uid) {
    // Usar verificación más robusta para el UID
    return notAuthenticatedResponse;
  }

  // Procesar la solicitud entrante
  const requestJson = await request.json();
  const {
    email: newEmail,
    displayName: newDisplayName,
    photoURL: newPhotoURL,
  } = JSON.parse(requestJson.body);

  // Destructurar el usuario para uso fácil de sus propiedades
  const { uid, email, displayName, photoURL, isAnonymous } = user;

  // Actualización condicional del email si el nuevo email es proporcionado
  if (newEmail && newEmail !== email) {
    // Asegura que el nuevo email es diferente
    try {
      await admin.auth().updateUser(uid, { email: newEmail });
      console.log("User email updated successfully");
    } catch (error) {
      console.error("Error updating user email:", error);
      return new Response(
        JSON.stringify({
          message: "Error updating user account",
          error: error.message,
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      message: "User account details retrieved successfully",
      user: {
        uid,
        email: newEmail || email, // Devolver nuevo email si la actualización fue exitosa
        displayName: newDisplayName || displayName, // Considerar también la actualización de displayName
        photoURL: newPhotoURL || photoURL, // Considerar también la actualización de photoURL
        isAnonymous,
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
};
