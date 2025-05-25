import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
    );
  } catch (error) {
    console.error("Webhook verification failed", error);
    return new NextResponse("Webhook error", { status: 400 });
  }

  try {
    // Handle subscription creation
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (!session.subscription) {
        return new NextResponse("No subscription ID", { status: 400 });
      }

      // Retrieve with explicit type casting
      const subscription = await stripe.subscriptions.retrieve(
        typeof session.subscription === 'string' 
          ? session.subscription 
          : session.subscription.id
      ) as unknown as Stripe.Subscription; // Double type casting here

      if (!session.metadata?.userId) {
        return new NextResponse("No user ID", { status: 400 });
      }

      // Prepare subscription data with proper type handling
      const subscriptionData = {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          (subscription as unknown as { current_period_end: number }).current_period_end * 1000
        ),
        stripeTrialEnd: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000)
          : null,
        status: subscription.status,
        updatedAt: new Date(),
      };

      // Update or insert subscription
      const existingSub = await db.select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, session.metadata.userId))
        .then(res => res[0]);

      if (existingSub) {
        await db.update(userSubscriptions)
          .set(subscriptionData)
          .where(eq(userSubscriptions.userId, session.metadata.userId));
      } else {
        await db.insert(userSubscriptions).values({
          userId: session.metadata.userId,
          ...subscriptionData,
          createdAt: new Date(),
        });
      }
    }

    // Handle subscription updates
    if (event.type === "invoice.payment_succeeded" || 
        event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      await db.update(userSubscriptions)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ),
          stripeTrialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          status: subscription.status,
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}