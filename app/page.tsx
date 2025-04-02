import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Spacer } from "@heroui/react";
import { Image } from "@heroui/image";

import PlansSection from "./PlansSection";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section>
      <div className="flex flex-row items-center justify-evenly gap-3 py-8 md:py-10">
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-xl text-center justify-center">
            <span className={title()}>
              Une plateforme de réservation &nbsp;
            </span>
            <span className={title({ color: "violet" })}>simple&nbsp;</span>
            <span className={title()}>,&nbsp;</span>
            <span className={title({ color: "violet" })}> rapide&nbsp;</span>
            <span className={title()}>et&nbsp;</span>
            <span className={title({ color: "violet" })}>sécurisée&nbsp;</span>
            <span className={title()}>pour vos événements</span>
            <div className={subtitle({ class: "mt-4" })}>
              Réservez facilement vos évènements en quelques clics, avec une
              gestion flexible et intuitive.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "secondary",
                radius: "full",
                variant: "shadow",
              })}
              href="/auth/login"
            >
              Commencer
            </Link>
          </div>
        </div>
        <Image
          src="/maquette.png"
          alt="Maquettepng logo"
          width={500}
          height={400}
          className="place-self-center"
        />
      </div>
      <Spacer y={10} />
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className="text-2xl">
            Créez des evenements de maniere&nbsp;
          </span>
          <span className="text-2xl text-purple-500">intuitive&nbsp;</span>
          <span className="text-2xl">
            et invitez vos contacts à y participer !&nbsp;
          </span>
        </div>
        <Image
          src="/createevent.png"
          alt="Maquettepng logo"
          width={800}
          height={450}
          className="place-self-center"
        />
      </div>
      <Spacer y={10} />
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className="text-2xl">Voyez et gérez tous les&nbsp;</span>
          <span className="text-2xl text-purple-500">événements&nbsp;</span>
          <span className="text-2xl">passés !&nbsp;</span>
        </div>
        <Image
          src="/createevent.png"
          alt="Maquettepng logo"
          width={800}
          height={450}
          className="place-self-center"
        />
      </div>
      <Spacer y={10} />
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
      <PlansSection />
    </section>
  );
}
