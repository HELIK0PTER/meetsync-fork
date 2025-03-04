import Image from "next/image";

export default function Home() {
  return (
      <div>
          <header className="flex justify-around text-xl mb-20 mt-3">
              <h1 className="uppercase">MEETSYNC</h1>
              <ul className="flex items-center flex-wrap gap-x-2">
                  <li><a href="#">Produits</a></li>
                  <li>Plans</li>
                  <li>Avis</li>
                  <li>Commencez</li>
              </ul>
          </header>

        <div className="flex justify-around text-xl items-center text-center gap-x-2">
            <div className="w-1/2">
                <h1 className="text-3xl">Une plateforme de réservation simple, rapide et sécurisée pour vos événements </h1>
                <h2 className="text-gray-400">Réservez facilement vos évènements en quelques clics, avec une gestion flexible et intuitive.</h2>
                <h3>Button</h3>
            </div>
            <div className="w-1/3 ">
                <Image src="/maquette.png" alt="Maquettepng logo" width={500} height={500} className=""/>
            </div>
        </div>
      </div>
  );
}
