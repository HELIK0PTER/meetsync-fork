"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase.from("profiles").select("subscription_plan, subscription_status").eq("id", user.id).single();
                setProfile(data);
            }
        };
        fetchProfile();
        // eslint-disable-next-line
    }, []);

    const hasActiveSubscription = profile && profile.subscription_plan && profile.subscription_plan !== 'basic';

    const handlePlanChange = async (planId: string) => {
        try {
            setLoading(planId);
            if (!user) throw new Error("Non authentifié");
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, userId: user.id }),
            });
            const { type, sessionId } = await response.json();
            if (type === 'basic') {
                window.location.reload();
                return;
            }
            if (type === 'stripe' && sessionId) {
                const stripe = await stripePromise;
                await stripe?.redirectToCheckout({ sessionId });
            }
        } catch {
            alert('Une erreur est survenue');
        } finally {
            setLoading(null);
        }
    };

    const handlePortal = async () => {
        if (!user) return;
        try {
            setLoading('portal');
            const res = await fetch('/api/create-customer-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erreur lors de la redirection vers le portail Stripe');
            }
        } catch {
            alert('Erreur lors de la redirection vers le portail Stripe');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Plans d'abonnement</h1>
            {hasActiveSubscription && (
                <div className="mb-8 flex flex-col items-center">
                    <div className="text-green-400 font-semibold mb-2">Vous avez déjà un abonnement actif ({profile.subscription_plan})</div>
                    <button
                        onClick={handlePortal}
                        disabled={loading === 'portal'}
                        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 mb-2"
                    >
                        {loading === 'portal' ? 'Chargement...' : 'Gérer mon abonnement Stripe'}
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                    <div key={key} className="bg-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">{plan.name}</h2>
                        <p className="text-3xl font-bold text-white mb-4">
                            {plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}
                        </p>
                        <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="text-gray-300 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handlePlanChange(plan.id)}
                            disabled={loading === plan.id || hasActiveSubscription}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {hasActiveSubscription
                                ? 'Abonnement actif'
                                : loading === plan.id
                                    ? 'Chargement...'
                                    : 'Choisir ce plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}