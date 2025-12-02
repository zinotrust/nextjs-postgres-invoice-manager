// app/api/webhook/stripe/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendEmail, updateMailAPIEmail } from "@/actions/emailActions";

const stripe = new Stripe(process.env.STRIPE_SECRET);
const webhookSecret = process.env.STRIPE_WEBHOOK;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;

  // Verify webhook
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const customerEmail = session.customer_details.email;
        const amount = session.amount_total / 100;

        console.log("✅ Payment completed:", customerEmail, amount);

        // 1. Find latest PENDING matching invoice
        const invoice = await prisma.invoice.findFirst({
          where: {
            customerEmail,
            amount,
            status: "PENDING",
          },
          orderBy: { createdAt: "desc" },
        });

        if (!invoice) {
          console.warn("⚠️ No matching invoice found");
          break;
        }

        // 2. Update invoice to PAID
        const updated = await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        console.log("✅ Invoice updated:", updated.id);

        // 3. Send receipt email
        await sendEmail({
          from: "InvoiceMgr <noreply@mail.mailapi.dev>",
          to: customerEmail,
          subject: `Payment Confirmed – ${invoice.purpose}`,
          template_id: "invoice_receipt",
          template_data: {
            purpose: invoice.purpose,
            amount: invoice.amount,
            paidAt: new Date().toISOString(),
          },
        });

        await updateMailAPIEmail({
          email: customerEmail,
          customFields: { status: "PAID", paidAt: new Date().toISOString() },
        });

        break;
      }

      default:
        console.log("⚠️ Unhandled Stripe event:", eventType);
    }
  } catch (err) {
    console.error(
      "❌ Error processing Stripe webhook:",
      err.message,
      "Event:",
      eventType
    );
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
