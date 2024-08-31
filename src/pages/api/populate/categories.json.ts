// src/pages/api/populateCategories.json.ts
import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

export const GET: APIRoute = async () => {
  const db = admin.firestore();
  const productsRef = db.collection("products");
  const categoriesRef = db.collection("categories");

  try {
    const categoriesSet = new Set();
    const productsSnapshot = await productsRef.select("category").get();

    // Recolectar todas las categorías únicas
    productsSnapshot.forEach((doc) => {
      const category = doc.data().category;
      if (doc.exists && category) {
        categoriesSet.add(category);
      }
    });

    const batch = db.batch();

    categoriesSet.forEach((category) => {
      const categoryDocRef = categoriesRef.doc(category as string);
      batch.set(categoryDocRef, { name: category });
    });

    // Ejecutar el batch para guardar todas las categorías
    await batch.commit();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Categories populated successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to populate categories:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to populate categories",
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
