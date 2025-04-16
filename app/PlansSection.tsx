import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { title } from "@/components/primitives";
import { createClient } from "@/utils/supabase/server";

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

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <h2 className={title({ color: "violet", size: "md" })}>
            Quand vous devrez aller plus loin
          </h2>
          <p className="text-lg">
            Choisissez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 px-4 w-full max-w-7xl">
          {PLANS.map((plan, index) => (
            <Card
              key={index}
              className={`relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl py-6 max-w-md mx-auto w-full
                ${plan.name === "Plus" ? "border-2 border-purple-500 shadow-lg" : "border border-gray-200"}`}
            >
              <CardHeader className="pb-0 pt-2 px-6 flex-col items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xl text-gray-600 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardBody className="px-6 py-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3 text-base"
                    >
                      <span
                        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center
                          ${
                            feature.included
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {feature.included ? (
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
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-base ${feature.included ? "" : "text-gray-500"}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="px-6">
                <Button
                  className={`w-full font-semibold shadow-sm transition-all duration-200
                    ${
                      plan.name === "Plus"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-white border-2 border-purple-600 hover:bg-purple-50"
                    }`}
                >
                  <Link
                    className={`w-full py-4 text-center text-base flex items-center justify-center
                      ${
                        plan.name === "Plus" ? "text-white" : "text-purple-600"
                      }`}
                    href={user ? "/dashboard/profile/plans" : "/auth/login"}
                  >
                    {plan.hasTrial
                      ? `Commencer l'essai gratuit de 30 jours`
                      : `Choisir ${plan.name}`}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlansSection;
