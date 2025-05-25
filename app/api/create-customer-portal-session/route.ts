import { NextResponse } from 'next/server';
import stripe from '@/utils/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const supabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer le stripe_customer_id de l'utilisateur
    const { data: user } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun stripe_customer_id trouvé.' }, { status: 400 });
    }

    // Créer la session de portail
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard/profil',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur portail client Stripe:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du portail client.' }, { status: 500 });
  }
} 