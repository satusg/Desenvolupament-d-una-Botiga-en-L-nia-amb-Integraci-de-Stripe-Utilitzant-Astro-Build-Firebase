import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

/**
 * Fetches all tags from the Firestore 'tags' collection.
 *
 * @returns {Response} A JSON response containing an array of all tags.
 */
export const GET: APIRoute = async () => {
  const db = admin.firestore();
  const tagsRef = db.collection("tags");

  try {
    const snapshot = await tagsRef.get();

    const tags = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return a successful response with the tags
    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve tags",
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
