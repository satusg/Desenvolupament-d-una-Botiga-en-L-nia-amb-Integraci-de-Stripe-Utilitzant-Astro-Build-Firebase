import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

/**
 * Fetches all categories from the Firestore 'categories' collection.
 *
 * @returns {Response} A JSON response containing an array of all categories.
 */
export const GET: APIRoute = async () => {
  const db = admin.firestore();
  const categoriesRef = db.collection("categories");

  try {
    const snapshot = await categoriesRef.get();

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return a successful response with the categories
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve categories",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
