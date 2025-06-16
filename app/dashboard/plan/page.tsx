"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useState } from "react";
import { SUBSCRIPTION_PLANS } from '@/utils/subscription-plans';
import { createClient } from '@/utils/supabase/client';

export default function PlanPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: user.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la redirection vers Stripe Checkout');
      }
    } catch {
      alert('Erreur lors de la redirection vers Stripe Checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Choisissez votre abonnement</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
          <Card key={key} className="bg-neutral-800 rounded-lg p-6 flex flex-col items-center">
            <CardHeader className="mb-4">
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
              <p className="text-3xl font-bold text-white mb-4">
                {plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.price === 0 ? (
                <Chip color="default">Inclus</Chip>
              ) : (
                <Button
                  color={key === 'plus' ? 'warning' : 'danger'}
                  onClick={() => handleSubscribe(key)}
                  isLoading={loading === key}
                  className="w-full"
                >
                  Souscrire à {plan.name}
                </Button>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
} 