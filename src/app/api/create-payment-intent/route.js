import { NextResponse } from "next/server";
const Stripe = require("stripe");

const getStripeSecretKey = () => {
  const candidateKeys = [
    process.env.STRIPE_SECRET_KEY,
    process.env.STRIPE_SECRET,
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
  ];

  const stripeSecretKey =
    candidateKeys.find((value) => typeof value === "string" && value.trim()) ||
    "";

  return stripeSecretKey.trim();
};

const createStripeClient = () => {
  const stripeSecretKey = getStripeSecretKey();

  if (!stripeSecretKey.startsWith("sk_")) {
    throw new Error(
      "Stripe secret key is missing or invalid. Set STRIPE_SECRET_KEY to a valid sk_ key.",
    );
  }

  return new Stripe(stripeSecretKey);
};

export async function POST(request) {
  try {
    const stripe = createStripeClient();
    const { amount, currency } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || "gbp",
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
