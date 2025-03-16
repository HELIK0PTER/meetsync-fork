import Image from "next/image";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div>
      <header className="flex justify-around text-xl mb-20 mt-3">
        <h1 className="uppercase logo">MEETSYNC</h1>
        <ul className="flex items-center flex-wrap gap-x-5">
            <Button>Produits</Button>
            <Button>Plans</Button>
            <Button>Avis</Button>
            <Button rounded>Commencez</Button>

        </ul>
      </header>

      <div className="flex justify-around text-xl items-center text-center gap-x-0">
      <div className="w-1/3 flex flex-col gap-y-3 items-center">
          <h1 className="title">Une plateforme de réservation simple, rapide et sécurisée pour vos événements </h1>
          <h2 className="subtitle">Réservez facilement vos évènements en quelques clics, avec une gestion flexible et intuitive.</h2>
          <Button rounded big>Commencez</Button>
        </div>
        <div className="w-1/2">
          <Image src="/maquette.png" alt="Maquettepng logo" width={500} height={500} className="place-self-center"/>
        </div>
      </div>
    </div>
  );
}
