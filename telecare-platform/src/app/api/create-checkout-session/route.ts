import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "edge";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd" } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum donation is $1." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Jusur (جسور) Platform Donation",
              description:
                "Support medical aid and platform development for Gaza healthcare",
              images: ["https://placehold.co/400x400/0A2540/FFFFFF?text=Jusur"],
            },
            unit_amount: amount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/cancelled`,
      metadata: {
        purpose: "jusur_donation",
        platform: "jusur",
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
