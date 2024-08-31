// src/pages/api/tags.json.ts
import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

/**
 * Fetches unique tags from the Firestore database.
 * This function queries the 'products' collection and aggregates all unique tag names.
 *
 * @returns {Response} A JSON response containing an array of unique tags.
 */
export const GET: APIRoute = async () => {
  const db = admin.firestore();
  const productsRef = db.collection("products");
  const tagsRef = db.collection("tags");

  try {
    const currentTags = new Set();
    const currentTagsSnapshot = await tagsRef.get();
    currentTagsSnapshot.forEach((doc) => {
      if (doc.exists) {
        currentTags.add(doc.id);
      }
    });

    const newTagsSet = new Set();
    const snapshot = await productsRef.get();
    snapshot.forEach((doc) => {
      if (doc.exists) {
        const tags = doc.data().tags;
        if (tags) {
          tags.forEach((tag) => {
            if (!currentTags.has(tag)) {
              newTagsSet.add(tag);
            }
          });
        }
      }
    });

    const batch = db.batch();
    newTagsSet.forEach((tag) => {
      if (!currentTags.has(tag)) {
        const tagDocRef = tagsRef.doc(tag as string);
        batch.set(tagDocRef, { name: tag });
      }
    });

    // Commit the batch to save all new tags
    if (newTagsSet.size > 0) {
      await batch.commit();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tags updated successfully.",
        newTags: Array.from(newTagsSet),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update tags:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update tags",
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
