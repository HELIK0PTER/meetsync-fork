import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import Image3D from "./Image3D";

import PlansSection from "./PlansSection";
import HeroCTA from "./HeroCTA";

import TestimonialsSlider from "@/components/TestimonialsSlider";
import { title, subtitle } from "@/components/primitives";

const features = [
  {
    title: "Création intuitive",
    description:
      "Créez des événements facilement en quelques clics avec notre interface intuitive",
    image: "/create_event.png",
  },
  {
    title: "Gestion complète",
    description:
      "Gérez tous vos événements passés et à venir depuis un seul endroit",
    image: "/createevent.png",
  },
  {
    title: "Multi-plateforme",
    description:
      "Accédez à votre compte depuis n'importe quel appareil, n'importe où",
    image: "/multiplatform.png",
  },
];

export default function Home() {
  return (
    <section className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="max-w-3xl mx-auto lg:mx-0">
                <h1 className="flex flex-col gap-4 sm:gap-6">
                  <div>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                      Une plateforme de réservation
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    <span className="text-purple-600">simple</span>
                    <span>, </span>
                    <span className="text-purple-600">rapide</span>
                    <span> et </span>
                    <span className="text-purple-600">sécurisée</span>
                  </div>
                </h1>
                <p className="mt-8 text-xl text-gray-200 max-w-xl mx-auto lg:mx-0">
                  Réservez facilement vos évènements en quelques clics, avec une
                  gestion flexible et intuitive.
                </p>
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                  <HeroCTA />
                </div>
              </div>
            </div>
            <Image3D
              id="maquette"
              src="/maquette.png"
              alt="Interface MeetSync"
              className="hidden lg:block w-full lg:w-2/3 max-w-3xl transform hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div id="product" className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-200">
              Une suite complète d&apos;outils pour gérer vos événements
              efficacement
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <CardBody className="relative">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={500}
                      height={375}
                      className="rounded-xl mb-6 transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <h3 className="text-xl font-semibold mb-4 text-purple-600">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-200">{feature.description}</p>
                  </CardBody>
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
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Vos Avis
            </h2>
            <p className="text-xl text-gray-200">
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
        <PlansSection />
      </div>
    </section>
  );
}
