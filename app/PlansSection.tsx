"use client";

import { Button, CardFooter, CardHeader } from "@heroui/react";
import { CardBody } from "@heroui/react";
import { Card } from "@heroui/react";
import { Spacer } from "@heroui/react";
import React from "react";

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

const PlansSection = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl justify-start">
          <span className="text-2xl">
            Quand vous devrez aller plus loin ...&nbsp;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 md:py-10">
          {PLANS.map((plan, index) => (
            <Card key={index} className="py-4 max-w-96 justify-self-center">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <span className="text-2xl text-center text-purple-600">
                  {plan.name}&nbsp;
                </span>
                <Spacer y={2} />
                <p>
                  <span className="text-3xl text-center">
                    {plan.price}&nbsp;
                  </span>
                  {plan.period && (
                    <span className="text-2xl text-gray-700">
                      {plan.period}
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Spacer y={5} />
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex}>
                    <p>
                      <span
                        className={`text-3xl ${feature.included ? "text-purple-600" : "text-red-800"}`}
                      >
                        {feature.included ? "✔" : "✘"}
                      </span>{" "}
                      <span
                        className={`text-2xl ${!feature.included ? "text-gray-600" : ""}`}
                      >
                        {feature.text}
                      </span>
                    </p>
                    <Spacer y={2} />
                  </div>
                ))}
              </CardBody>
              <CardFooter>
                {plan.hasTrial && (
                  <Button color="secondary" className="text-2xl w-full">
                    {`30 jours d'essai gratuit`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlansSection;
