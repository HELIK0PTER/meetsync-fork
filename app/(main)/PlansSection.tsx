import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { createClient } from "@/utils/supabase/server";
import Title from "./_components/Title";
import { SUBSCRIPTION_PLANS } from '@/utils/subscription-plans';

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period?: string;
  features: Feature[];
  hasTrial?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    price: "GRATUIT",
    features: [
      { text: "2 événements simultanés", included: true },
      { text: "20 invitations par événement", included: true },
      { text: "Pas de personnalisation des invitations", included: false },
      { text: "Pas d'envoi automatique des rappels", included: false },
    ],
  },
  {
    name: "Plus",
    price: "10€",
    period: "/mois",
    hasTrial: true,
    features: [
      { text: "10 événements simultanés", included: true },
      { text: "300 invitations par événement", included: true },
      { text: "8 invitations personnalisables par mois", included: true },
      { text: "Pas d'envoi automatique des rappels", included: false },
    ],
  },
  {
    name: "Pro",
    price: "200€",
    period: "/mois",
    hasTrial: true,
    features: [
      { text: "Événements simultanés illimités", included: true },
      { text: "Invitations par événement illimitées", included: true },
      { text: "300 invitations personnalisables par mois", included: true },
      { text: "Rappels par mails automatiques configurables", included: true },
    ],
  },
];

const PlansSection = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Récupérer le profil pour savoir si l'utilisateur a déjà un abonnement
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("subscription_plan, subscription_status").eq("id", user.id).single();
    profile = data;
  }

  // Fonction pour gérer le clic sur le bouton
  const getButtonProps = (planKey: string) => {
    if (!user) {
      return {
        href: "/auth/login",
        children: "Se connecter pour souscrire"
      };
    }

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const hasActiveSubscription = profile?.subscription_plan && 
                                profile.subscription_plan !== 'basic' && 
                                profile.subscription_status === 'active';

    if (hasActiveSubscription) {
      // Si déjà abonné, redirige vers le portail client Stripe
      return {
        onClick: async () => {
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
        },
        children: 'Gérer mon abonnement Stripe',
        disabled: false
      };
    } else {
      // Sinon, redirige vers la page d'abonnement (checkout)
      return {
        href: `/dashboard/plan`,
        children: `Souscrire à ${planKey.charAt(0).toUpperCase() + planKey.slice(1).toLowerCase()}`,
        disabled: false
      };
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <Title
            titre = {`Quand vous devrez aller plus loin`}
            description = {`Choisissez le plan qui correspond le mieux à vos besoins`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 px-4 w-full max-w-7xl">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan], index) => (
            <Card
              key={index}
              className={`relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl py-6 max-w-md mx-auto w-full
                ${plan.name === "Plus" ? "border-2 border-purple-500 shadow-lg" : "border border-gray-200"}`}
            >
              <CardHeader className="pb-0 pt-2 px-6 flex-col items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold">{plan.price === 0 ? 'GRATUIT' : `${plan.price}€`}</span>
                </div>
              </CardHeader>
              <CardBody className="px-6 py-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3 text-base"
                    >
                      <span className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="px-6">
                {(() => {
                  const btnProps = getButtonProps(key.toLowerCase());
                  const hasActiveSubscription = profile?.subscription_plan && 
                                             profile.subscription_plan !== 'basic';

                  if (btnProps.href) {
                    // Cas lien : bouton avec Link à l'intérieur
                    return (
                      <Button
                        className={`w-full font-semibold shadow-sm transition-all duration-200
                          ${plan.name === "Plus"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600"}
                          ${hasActiveSubscription ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={hasActiveSubscription}
                      >
                        <Link 
                          href={btnProps.href} 
                          className={`w-full py-4 text-center text-purple flex items-center justify-center
                            ${hasActiveSubscription ? 'pointer-events-none' : ''}`}
                        >
                          {hasActiveSubscription ? 'Abonnement actif' : btnProps.children}
                        </Link>
                      </Button>
                    );
                  } else {
                    // Cas bouton action
                    return (
                      <Button
                        className={`w-full font-semibold shadow-sm transition-all duration-200
                          ${plan.name === "Plus"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600"}
                        `}
                        onClick={btnProps.onClick}
                        disabled={btnProps.disabled}
                      >
                        {btnProps.children}
                      </Button>
                    );
                  }
                })()}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlansSection;
