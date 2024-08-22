import { type APIRoute } from "astro";
import { getCurrentUser, authenticateForCart } from "@/utils/authentication";
import admin from "@/firebase/admin";
import Stripe from "stripe";
interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  quantity: number;
  tax_code?: string;
}

export const POST: APIRoute = async ({ params, request }) => {
  const user = await authenticateForCart();
  // const requestBody = await request.json();
  // const { product, quantity } = requestBody;
  try {
    if (user?.uid === null || user?.uid === undefined) {
      throw new Error("User has not been authenticated");
    }

    const cartRef = admin.firestore().collection("carts").doc(`${user.uid}`);

    const doc = await cartRef.get();
    if (!doc.exists) {
      throw new Error("Cart does not exist");
    }
    const cartData = doc.data();
    const { products, total } = cartData;
    const stripe = new Stripe(import.meta.env.PRIVATE_STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: user.uid, // User ID ( to link the payment to the user )
      customer_email: user.email, // User email ( to send the receipt )
      line_items: Object.values(products).map((product: Product) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.title,
            description: product.description,
            images: product.images,
            tax_code: product?.tax_code || "txcd_99999999", // Tax code for the product ( If not provided, the default tax code is used (general goods) )
          },
          tax_behavior: "exclusive", // Exclusive ( is added on top of the price as stripe handles the address obt. )
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "ES", "IT"],
      },

      // Define shipping options
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500, // 5 EUR shipping cost
              currency: "eur",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500, // 15 EUR shipping cost
              currency: "eur",
            },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],

      mode: "payment",
      automatic_tax: {
        enabled: true, // Enable automatic tax calculation
      },
      success_url: `${request.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/cancel`,
      billing_address_collection: "required", // Collect the customer's billing address
    });
    // Intent to save the session ID in the database with the products and the user ID and the total amount in order to be able to retrieve the data later and associate it with the user and the actual products which have been bought
    const sessionRef = admin.firestore().collection("checkout").doc(session.id);

    await sessionRef.set({
      products,
      user: user.uid,
      total,
      status: "pending",
      session_id: session.id,
    });

    return new Response(
      JSON.stringify({
        id: session.id,
        message: "Payment checkout session created successfully",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        currentUser: user,
        message: "Error creating the payment ",
        error: e.message,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
