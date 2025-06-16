import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import stripe from '@/utils/stripe';
import { SUBSCRIPTION_PLANS } from '@/utils/subscription-plans';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        const supabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const customerId = (session as any).customer;
                const subscriptionId = (session as any).subscription;
                let periodEnd = null;
                let status = 'active';
                let planId = null;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
                    const currentPeriodEnd = (subscription as any).current_period_end;
                    if (typeof currentPeriodEnd === 'number' && !isNaN(currentPeriodEnd)) {
                        periodEnd = new Date(currentPeriodEnd * 1000).toISOString();
                    }
                    status = (subscription as any).status || 'active';
                    if ((subscription as any).items && (subscription as any).items.data.length > 0) {
                        const priceId = (subscription as any).items.data[0].price.id;
                        planId = Object.entries(SUBSCRIPTION_PLANS).find(
                            ([, plan]) => plan.stripePriceId === priceId
                        )?.[1].id || null;
                    }
                }

                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: status,
                        subscription_end_date: periodEnd,
                        subscription_plan: planId,
                    })
                    .eq('stripe_customer_id', customerId);
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const periodEndRaw = (subscription as any).current_period_end;
                let periodEnd = null;
                let planId = null;
                if (typeof periodEndRaw === 'number' && !isNaN(periodEndRaw)) {
                    periodEnd = new Date(periodEndRaw * 1000).toISOString();
                }
                if ((subscription as any).items && (subscription as any).items.data.length > 0) {
                    const priceId = (subscription as any).items.data[0].price.id;
                    planId = Object.entries(SUBSCRIPTION_PLANS).find(
                        ([, plan]) => plan.stripePriceId === priceId
                    )?.[1].id || null;
                }
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: (subscription as any).status,
                        subscription_end_date: periodEnd,
                        subscription_plan: planId,
                    })
                    .eq('stripe_customer_id', (subscription as any).customer);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await supabase
                    .from('profiles')
                    .update({
                        subscription_plan: 'basic',
                        subscription_status: 'inactive',
                        subscription_end_date: null
                    })
                    .eq('stripe_customer_id', (subscription as any).customer);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch {
        return NextResponse.json(
            { error: 'Erreur webhook' },
            { status: 400 }
        );
    }
}