import type { APIRoute } from "astro";
import { authenticateForCart } from "@/utils/authentication";
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
  try {
    // Procesar la solicitud entrante
    const requestJson = await request.json();
    const newEmail = requestJson.email;
    console.log(newEmail);
    // Destructurar el usuario para uso fácil de sus propiedades
    const { email } = user;

    // Actualización condicional del email si el nuevo email es proporcionado
    if (newEmail && newEmail !== email) {
      // Asegura que el nuevo email es diferente
      const userRecord = await admin.auth().getUserByEmail(newEmail);
      console.log(userRecord);
      if (userRecord) {
        return new Response(
          JSON.stringify({
            valid: false,
            message: "Email is already in use",
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({
          valid: true,
          message: "Email is valid",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    } else if (newEmail && newEmail === email) {
      return new Response(
        JSON.stringify({
          valid: true,
          message: "Email is the same as the current email",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error verifying the email:", error);
  }
  return new Response(
    JSON.stringify({
      valid: false,
      message: "Email is not valid",
    }),
    {
      status: 401,
      headers: { "content-type": "application/json" },
    }
  );
};
