// app/api/webhook/stripe/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { updateMailAPIEmail } from "@/actions/emailActions";

// https://dashboard.stripe.com/test/settings/billing/portal

// stripe login
// stripe listen --forward-to localhost:3000/api/webhook/stripe
// stripe listen --forward-to https://invoicemgr.vercel.app/api/webhook/stripe

const stripe = new Stripe(process.env.STRIPE_SECRET);
const webhookSecret = process.env.STRIPE_WEBHOOK;

export async function POST(req) {
  console.log("Stripe webhook received");

  

  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created
        // ✅ Grant access to the product
        let user;
        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ["line_items"],
          }
        );
        // console.log("---- session ----", session);

        // console.log("session", session?.line_items?.data);
        const priceId = session?.line_items?.data[0]?.price.id;

        // update mailapi record
        const customerEmail = session?.customer_details.email;
        const amount = session?.amount_total / 100;

        const invoice = await prisma.invoice.updateMany({
          where: {
            customerEmail,
            amount,
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        await updateMailAPIEmail({
          email: userEmail,
          customFields: {
            status: "PAID",
            paidAt: new Date().toISOString(),
          },
        });

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
