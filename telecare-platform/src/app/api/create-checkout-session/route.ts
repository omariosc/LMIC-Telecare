import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  console.log("API Route Called: /api/create-checkout-session");
  
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      );
    }

    // Log partial key for debugging (first and last 4 chars)
    const secretKey = process.env.STRIPE_SECRET_KEY;
    console.log("Using Stripe Secret Key:", secretKey.substring(0, 7) + "..." + secretKey.slice(-4));

    const { amount, currency = "usd" } = await request.json();
    console.log("Request data:", { amount, currency });

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum donation is $1." },
        { status: 400 }
      );
    }

    console.log("Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Jusur (جسور) Platform Donation",
              description:
                "Support platform development for Gaza healthcare",
              images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://jusur.org.uk'}/images/jusur-logo.png`],
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

    console.log("Stripe session created successfully:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// Removing edge runtime to troubleshoot Stripe API issues
// export const runtime = "edge";
