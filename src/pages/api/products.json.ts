import { type APIRoute } from "astro";
import admin from "@/firebase/admin";

/**
 * Function used to handle the GET request to retrieve the products from the database
 * @param param0 {params, request}
 * @returns {Response} Response with the products obtained from the database
 * as well as the total number of products available, next and previous page params if available
 */
export const GET: APIRoute = async ({ params, request }) => {
  const db = admin.firestore();
  try {
    const url = new URL(request.url);
    const urlParams = url.searchParams;
    const productsRef = db.collection("products");
    const limit = Math.max(
      Math.min(parseInt(urlParams.get("limit") || "10"), 100),
      10
    ); // limiting the number of total products to 100
    let productsQuery = productsRef.orderBy("createdAt").limit(limit);
    let nextUrl = null;
    let prevUrl = null;

    // Handle pagination for the next page
    if (urlParams.has("last")) {
      try {
        const lastDoc = await productsRef.doc(urlParams.get("last")).get();
        if (lastDoc.exists) {
          productsQuery = productsQuery.startAfter(lastDoc);
        }
      } catch (e) {
        console.log(
          "An error has occurred while trying to get the last document. Error:" +
            e.message
        );
      }
    }

    const productsSnapshot = await productsQuery.get();
    const productsData = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const firstDoc = productsSnapshot.docs[0];
    const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];

    // Construct URLs for next and previous pages
    if (productsSnapshot.docs.length === limit) {
      nextUrl = `${url.origin}${url.pathname}?limit=${limit}&last=${lastDoc.id}`;
    }

    if (firstDoc) {
      try {
        // Check if there are documents before the firstDoc
        const previousQuery = productsRef
          .orderBy("createdAt")
          .endBefore(firstDoc)
          .limitToLast(1);
        const previousSnapshot = await previousQuery.get();
        if (!previousSnapshot.empty) {
          prevUrl = `${url.origin}${url.pathname}?limit=${limit}&first=${firstDoc.id}`;
        }
      } catch (e) {
        console.log(
          "An error has occurred while trying to get the first document. Error:" +
            e.message
        );
      }
    }
    let totalProductsCount = 0;
    try {
      const totalProductsQuery = db.collection("products").count();
      const totalProductsSnapshot = await totalProductsQuery.get();
      totalProductsCount = totalProductsSnapshot.data().count;
    } catch (e) {
      console.log(
        "An error has occurred while trying to get the total number of products. Error:" +
          e.message
      );
    }

    return new Response(
      JSON.stringify({
        products: productsData,
        firstDocId: firstDoc ? firstDoc.id : null,
        lastDocId: lastDoc ? lastDoc.id : null,
        totalProductsCount: totalProductsCount,
        nextUrl,
        prevUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error:
          "An error occurred while trying to retrieve the products from the database",
        explicit: e.message,
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
