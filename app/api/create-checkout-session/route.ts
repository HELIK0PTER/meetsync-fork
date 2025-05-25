import { NextResponse } from 'next/server';
import stripe from '@/utils/stripe';
import { createClient } from '@/utils/supabase/server';
import { SUBSCRIPTION_PLANS } from '@/utils/subscription-plans';

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    const supabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer le stripe_customer_id de l'utilisateur
    const { data: user } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    // Si l'utilisateur n'a pas de customer_id Stripe, en créer un
    let customerId = user?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || '',
        metadata: { userId }
      });
      customerId = customer.id;
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Récupérer l'ID Stripe du plan
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan?.stripePriceId) {
      return NextResponse.json({ error: 'Plan non valide' }, { status: 400 });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard/profil?success=true',
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard/profil?canceled=true',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la session' }, { status: 500 });
  }
} 