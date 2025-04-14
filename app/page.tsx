"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Spacer } from "@heroui/react";
import { Image } from "@heroui/image";
import { Card } from "@heroui/react";

import PlansSection from "./PlansSection";
import TestimonialsSlider from "@/components/TestimonialsSlider";

import { title, subtitle } from "@/components/primitives";
import {useUser} from "@/lib/UserContext";

const features = [
  {
    title: "Création intuitive",
    description: "Créez des événements facilement en quelques clics avec notre interface intuitive",
    image: "/create_event.png"
  },
  {
    title: "Gestion complète",
    description: "Gérez tous vos événements passés et à venir depuis un seul endroit",
    image: "/createevent.png"
  },
  {
    title: "Multi-plateforme",
    description: "Accédez à votre compte depuis n'importe quel appareil, n'importe où",
    image: "/multiplatform.png"
  }
];

export default function Home() {
  const { user, loading } = useUser();
  return (
      <section className="w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
                className="mx-auto max-w-2xl lg:max-w-none flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="max-w-3xl mx-auto lg:mx-0">
                  <h1 className="flex flex-col gap-2 sm:gap-3">
                    <div>
                    <span className={title({size: "sm"})}>
                      Une plateforme de réservation
                    </span>
                    </div>
                    <div>
                      <span className={title({color: "violet", size: "sm"})}>simple</span>
                      <span className={title({size: "sm"})}>, </span>
                      <span className={title({color: "violet", size: "sm"})}>rapide</span>
                      <span className={title({size: "sm"})}> et </span>
                      <span className={title({color: "violet", size: "sm"})}>sécurisée</span>
                    </div>
                    <div>
                    </div>
                  </h1>
                  <p className={subtitle({class: "mt-6 max-w-xl mx-auto lg:mx-0"})}>
                    Réservez facilement vos évènements en quelques clics, avec une
                    gestion flexible et intuitive.
                  </p>
                  <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">

                    {user ? (
                        <Link
                            href="/dashboard"
                            className={buttonStyles({
                              color: "secondary",
                              radius: "full",
                              variant: "shadow",
                              size: "lg",
                            })}
                        >
                          Tableau de bord
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className={buttonStyles({
                              color: "secondary",
                              radius: "full",
                              variant: "shadow",
                              size: "lg",
                            })}
                        >
                          Commencer gratuitement
                        </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <Image
                    src="/maquette.png"
                    alt="Interface MeetSync"
                    className="hidden lg:block transform hover:scale-105 transition-transform duration-500 rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div id="product" className="mx-auto max-w-2xl text-center">
              <h2 className={title({color: "violet", size: "md"})}>Tout ce dont vous avez besoin</h2>
              <p className={subtitle({class: "mt-6"})}>
                Une suite complète d'outils pour gérer vos événements efficacement
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                {features.map((feature, index) => (
                    <Card key={index}
                          className="group p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <Image
                            src={feature.image}
                            alt={feature.title}
                            width={400}
                            height={300}
                            className="rounded-xl mb-6 transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <h3 className="text-xl font-semibold mb-3 text-purple-600">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avis */}
        <div className="py-24 sm:py-32">
          <div id="review" className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className={title({color: "violet", size: "md"})}>Vos Avis</h2>
              <p className={subtitle({class: "mt-6"})}>
                Parceque vos retours sont importants pour nous
              </p>
            </div>
            <div className="mt-16">
              <TestimonialsSlider />
            </div>
          </div>
        </div>

          {/* Plans Section */}
          <div className="" id="plans">
            <PlansSection/>
          </div>
      </section>
);
}
