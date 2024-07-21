import { type APIRoute } from "astro";
import admin from "@/firebase/admin";
import axios from "axios";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const response = await axios.get("https://dummyjson.com/products?limit=0");
    const products = response.data.products;
    const db = admin.firestore();
    const batch = db.batch();

    products.forEach((product: any) => {
      const {
        title,
        description,
        category,
        price,
        discountPercentage,
        rating,
        stock,
        tags,
        weight,
        dimensions,
        meta,
        images,
        thumbnail,
      } = product;

      const { createdAt, updatedAt } = meta;
      const { width, height, depth } = dimensions;

      const productRef = db.collection("products").doc(`${product.id}`);
      batch.set(productRef, {
        title,
        description,
        category,
        price,
        discountPercentage,
        rating,
        stock,
        tags,
        weight,
        dimensions: { width, height, depth },
        createdAt: admin.firestore.Timestamp.fromDate(new Date(createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(updatedAt)),
        images,
        thumbnail,
        active: true,
      });
    });

    await batch.commit();

    return new Response(
      JSON.stringify({ message: "Products created successfully" }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating products:", error);
    return new Response(
      JSON.stringify({
        message: "Error creating the products",
        error: error.message,
      }),
      { headers: { "content-type": "application/json" } }
    );
  }
};
