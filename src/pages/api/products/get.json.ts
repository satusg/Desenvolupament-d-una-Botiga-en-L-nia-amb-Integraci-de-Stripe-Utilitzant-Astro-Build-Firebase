import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

/**
 * Construct Firestore query based on URL search parameters.
 * @param {URLSearchParams} urlParams - URL search parameters for filtering and pagination.
 * @param {FirebaseFirestore.CollectionReference} productsRef - Reference to the Firestore products collection.
 */
const constructQuery = async (urlParams, productsRef) => {
  let query = productsRef.orderBy("createdAt");
  const limit = Math.min(parseInt(urlParams.get("limit") || "10"), 100);
  query = query.limit(limit);

  // Apply filters dynamically
  const filterFields = ["category", "priceMin", "priceMax"];
  filterFields.forEach((field) => {
    if (urlParams.has(field) && field === "priceMin") {
      query = query.where("price", ">=", parseFloat(urlParams.get(field)));
    } else if (urlParams.has(field) && field === "priceMax") {
      query = query.where("price", "<=", parseFloat(urlParams.get(field)));
    } else if (urlParams.has(field)) {
      query = query.where(field, "==", urlParams.get(field));
    }
  });
  if (urlParams.has("tags")) {
    const tags = urlParams.get("tags").split(",");
    tags.forEach((tag) => {
      query = query.where("tags", "array-contains", tag);
    });
  }

  if (urlParams.has("last")) {
    const lastDoc = await productsRef.doc(urlParams.get("last")).get();
    if (lastDoc.exists) query = query.startAfter(lastDoc);
  } else if (urlParams.has("first")) {
    const firstDoc = await productsRef.doc(urlParams.get("first")).get();
    if (firstDoc.exists) query = query.endBefore(firstDoc).limitToLast(limit);
  }

  return query;
};

export const GET: APIRoute = async ({ request }) => {
  const db = admin.firestore();
  try {
    const url = new URL(request.url);
    const productsRef = db.collection("products");
    const query = await constructQuery(url.searchParams, productsRef);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({
          error: "No products found.",
          messahe: "No products found",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const firstDoc = snapshot.docs[0];
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    // Construct next and previous URLs for pagination
    const nextUrl = lastDoc
      ? `${url.origin}${url.pathname}?limit=${snapshot.size}&last=${lastDoc.id}`
      : null;
    const prevUrl = firstDoc
      ? `${url.origin}${url.pathname}?limit=${snapshot.size}&first=${firstDoc.id}`
      : null;

    return new Response(JSON.stringify({ products, nextUrl, prevUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Failed to fetch products:", e);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve products",
        message: e.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
