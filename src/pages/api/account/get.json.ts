import type { APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";

export const GET: APIRoute = async ({ params, request }) => {
  if (getCurrentUser() === null) {
    return notAuthenticatedResponse;
  }
  const user = await authenticateForCart();
  if (user?.uid === null || user?.uid === undefined) {
    return notAuthenticatedResponse;
  }
  const { uid, email, displayName, photoURL, isAnonymous } = user;
  const db = admin.firestore();
  const paymentsRef = db.collection("payments");
  const payments = await paymentsRef.where("userId", "==", uid).get();
  const userPayments = payments.docs.map((doc) => doc.data());
  return new Response(
    JSON.stringify({
      message: "User account details retrieved successfully",
      user: {
        uid,
        email,
        displayName,
        photoURL,
        isAnonymous,
      },
      payments: userPayments,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
};
const notAuthenticatedResponse = new Response(
  JSON.stringify({ error: "User has not been authenticated" }),
  {
    status: 401,
    headers: { "content-type": "application/json" },
  }
);
