"use client";

import { Button, CardHeader } from "@heroui/react";
import { CardBody } from "@heroui/react";
import { Card } from "@heroui/react";
import { Spacer } from "@heroui/react";
import Image from "next/image";
import React from "react";

const PlansSection = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className="text-2xl">Accessible sur&nbsp;</span>
          <span className="text-2xl text-purple-500">tous&nbsp;</span>
          <span className="text-2xl">vos appareils&nbsp;</span>
        </div>
        <Image
          src="/multiplatform.png"
          alt="Maquettepng logo"
          width={450}
          height={450}
          className="place-self-center"
        />
      </div>
      <Spacer y={10} />
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl justify-start">
          <span className="text-2xl">
            Quand vous devrez aller plus loin ...&nbsp;
          </span>
        </div>

        <div className="flex flex-row items-start justify-center gap-6 py-8 md:py-10">
          <Card className="py-4 max-w-96">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <span className="text-2xl text-center text-purple-600">
                Basic&nbsp;
              </span>
              <Spacer y={2} />
              <span className="text-3xl text-center">GRATUIT&nbsp;</span>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Spacer y={5} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">2 évenements simultanés</span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">20 invitations par évènements</span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-gray-700">✘</span>{" "}
                <span className="text-2xl  text-gray-700">
                  Pas de personnalisation des invitations
                </span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-gray-700">✘</span>{" "}
                <span className="text-2xl  text-gray-700">
                  Pas d’envoi automatique des rappel
                </span>
              </p>
              <Spacer y={5} />
            </CardBody>
          </Card>

          <Card className="py-4 max-w-96">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <span className="text-2xl text-center text-purple-600">
                Plus&nbsp;
              </span>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-center">10€&nbsp;</span>{" "}
                <span className="text-2xl text-gray-700">/mois</span>
              </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Spacer y={5} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">10 évenements simultanés</span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">300 invitations par évènements</span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">
                  8 invitations personnalisables par mois
                </span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-gray-700">✘</span>{" "}
                <span className="text-2xl  text-gray-700">
                  Pas d’envoi automatique des rappel
                </span>
              </p>
              <Spacer y={5} />
              <Button color="secondary" className="text-2xl">
                30 jours d’essai gratuit
              </Button>
            </CardBody>
          </Card>

          <Card className="py-4 max-w-96">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <span className="text-2xl text-center text-purple-600">
                Pro&nbsp;
              </span>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-center">200€&nbsp;</span>{" "}
                <span className="text-2xl text-gray-700">/mois</span>
              </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Spacer y={5} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">
                  évenements simultanés illimités
                </span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">
                  invitations par évènements illimitées
                </span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">
                  300 invitations personnalisables par mois
                </span>
              </p>
              <Spacer y={2} />
              <p>
                <span className="text-3xl text-purple-600">✔</span>{" "}
                <span className="text-2xl">
                  Rappels par mails automatiques configurables
                </span>
              </p>
              <Spacer y={5} />
              <Button color="secondary" className="text-2xl">
                30 jours d’essai gratuit
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlansSection;
