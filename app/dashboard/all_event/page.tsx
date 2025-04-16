"use client";

import { Card, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Tooltip } from "@heroui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Définition du type pour les événements
type Event = {
  id: string;
  name: string;
  date: Date;
  formattedDate: string;
  city: string;
  country: string;
  price: number | null;
  attendees: number;
  owner_name: string;
  animationDelay?: number;
};

// Liste de 30 événements de test avec des données variées
const testEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: new Date(2025, 5, 15),
    formattedDate: "15/06/2025",
    city: "Paris",
    country: "France",
    price: 99.99,
    attendees: 500,
    owner_name: "TechEvents Inc."
  },
  {
    id: "2",
    name: "Festival de Musique Électronique",
    date: new Date(2025, 6, 20),
    formattedDate: "20/07/2025",
    city: "Marseille",
    country: "France",
    price: 75,
    attendees: 2500,
    owner_name: "SoundWave Productions"
  },
  {
    id: "3",
    name: "Atelier de Cuisine Italienne",
    date: new Date(2025, 4, 10),
    formattedDate: "10/05/2025",
    city: "Lyon",
    country: "France",
    price: 45,
    attendees: 20,
    owner_name: "Chef Antonio"
  },
  {
    id: "4",
    name: "Exposition d'Art Contemporain",
    date: new Date(2025, 7, 5),
    formattedDate: "05/08/2025",
    city: "Bordeaux",
    country: "France",
    price: 12.50,
    attendees: 150,
    owner_name: "Galerie Moderne"
  },
  {
    id: "5",
    name: "Marathon de Madrid",
    date: new Date(2025, 9, 12),
    formattedDate: "12/10/2025",
    city: "Madrid",
    country: "Espagne",
    price: 30,
    attendees: 3000,
    owner_name: "Madrid Sports"
  },
  {
    id: "6",
    name: "Conférence sur l'Intelligence Artificielle",
    date: new Date(2025, 8, 25),
    formattedDate: "25/09/2025",
    city: "Berlin",
    country: "Allemagne",
    price: 150,
    attendees: 350,
    owner_name: "AI Future Network"
  },
  {
    id: "7",
    name: "Visite Guidée du Colisée",
    date: new Date(2025, 5, 30),
    formattedDate: "30/06/2025",
    city: "Rome",
    country: "Italie",
    price: 25,
    attendees: 50,
    owner_name: "Roma Tours"
  },
  {
    id: "8",
    name: "Meetup Développeurs Web",
    date: new Date(2025, 4, 22),
    formattedDate: "22/05/2025",
    city: "Toulouse",
    country: "France",
    price: null,
    attendees: 75,
    owner_name: "CodeCommunity"
  },
  {
    id: "9",
    name: "Workshop Design Thinking",
    date: new Date(2025, 5, 8),
    formattedDate: "08/06/2025",
    city: "Amsterdam",
    country: "Pays-Bas",
    price: 65,
    attendees: 40,
    owner_name: "Creative Minds"
  },
  {
    id: "10",
    name: "Tournoi de Tennis Amateur",
    date: new Date(2025, 6, 12),
    formattedDate: "12/07/2025",
    city: "Barcelone",
    country: "Espagne",
    price: 15,
    attendees: 128,
    owner_name: "Club de Tennis BCN"
  },
  {
    id: "11",
    name: "Hackathon Blockchain",
    date: new Date(2025, 8, 5),
    formattedDate: "05/09/2025",
    city: "Zurich",
    country: "Suisse",
    price: null,
    attendees: 120,
    owner_name: "CryptoInnovation"
  },
  {
    id: "12",
    name: "Cours de Yoga en Plein Air",
    date: new Date(2025, 6, 5),
    formattedDate: "05/07/2025",
    city: "Nice",
    country: "France",
    price: 10,
    attendees: 30,
    owner_name: "Zen Attitude"
  },
  {
    id: "13",
    name: "Concert Symphonique",
    date: new Date(2025, 10, 18),
    formattedDate: "18/11/2025",
    city: "Vienne",
    country: "Autriche",
    price: 85,
    attendees: 1200,
    owner_name: "Orchestre National"
  },
  {
    id: "14",
    name: "Salon de l'Agriculture",
    date: new Date(2025, 2, 15),
    formattedDate: "15/03/2025",
    city: "Paris",
    country: "France",
    price: 18,
    attendees: 5000,
    owner_name: "AgriExpo"
  },
  {
    id: "15",
    name: "Réunion Startup Weekend",
    date: new Date(2025, 5, 20),
    formattedDate: "20/06/2025",
    city: "Lisbonne",
    country: "Portugal",
    price: 50,
    attendees: 200,
    owner_name: "Startup Lisboa"
  },
  {
    id: "16",
    name: "Séminaire sur la Finance Durable",
    date: new Date(2025, 9, 8),
    formattedDate: "08/10/2025",
    city: "Genève",
    country: "Suisse",
    price: 199,
    attendees: 80,
    owner_name: "Swiss Finance Institute"
  },
  {
    id: "17",
    name: "Projection de Films Indépendants",
    date: new Date(2025, 7, 15),
    formattedDate: "15/08/2025",
    city: "Bruxelles",
    country: "Belgique",
    price: 8,
    attendees: 100,
    owner_name: "CinéArt"
  },
  {
    id: "18",
    name: "Forum de l'Emploi Tech",
    date: new Date(2025, 3, 25),
    formattedDate: "25/04/2025",
    city: "Munich",
    country: "Allemagne",
    price: null,
    attendees: 650,
    owner_name: "TechJobs Bavaria"
  },
  {
    id: "19",
    name: "Atelier de Peinture pour Débutants",
    date: new Date(2025, 4, 18),
    formattedDate: "18/05/2025",
    city: "Florence",
    country: "Italie",
    price: 35,
    attendees: 15,
    owner_name: "Atelier de Lorenzo"
  },
  {
    id: "20",
    name: "Conférence Développement Durable",
    date: new Date(2025, 11, 10),
    formattedDate: "10/12/2025",
    city: "Stockholm",
    country: "Suède",
    price: 75,
    attendees: 300,
    owner_name: "Green Future"
  },
  {
    id: "21",
    name: "Séance de Dédicace Littéraire",
    date: new Date(2025, 6, 28),
    formattedDate: "28/07/2025",
    city: "Lyon",
    country: "France",
    price: null,
    attendees: 50,
    owner_name: "Librairie du Quartier"
  },
  {
    id: "22",
    name: "Festival de Gastronomie",
    date: new Date(2025, 8, 15),
    formattedDate: "15/09/2025",
    city: "Porto",
    country: "Portugal",
    price: 25,
    attendees: 1500,
    owner_name: "Saveurs Portugaises"
  },
  {
    id: "23",
    name: "Course à Pied Caritative",
    date: new Date(2025, 4, 30),
    formattedDate: "30/05/2025",
    city: "Dublin",
    country: "Irlande",
    price: 20,
    attendees: 800,
    owner_name: "Run for Hope"
  },
  {
    id: "24",
    name: "Salon du Livre Ancien",
    date: new Date(2025, 10, 5),
    formattedDate: "05/11/2025",
    city: "Strasbourg",
    country: "France",
    price: 12,
    attendees: 250,
    owner_name: "Bibliophiles Association"
  },
  {
    id: "25",
    name: "Conférence Cybersécurité",
    date: new Date(2025, 9, 20),
    formattedDate: "20/10/2025",
    city: "Helsinki",
    country: "Finlande",
    price: 180,
    attendees: 220,
    owner_name: "CyberDefense Nordic"
  },
  {
    id: "26",
    name: "Atelier Photographie de Paysage",
    date: new Date(2025, 7, 8),
    formattedDate: "08/08/2025",
    city: "Prague",
    country: "République Tchèque",
    price: 40,
    attendees: 25,
    owner_name: "VisionArt"
  },
  {
    id: "27",
    name: "Dégustation de Vins",
    date: new Date(2025, 5, 12),
    formattedDate: "12/06/2025",
    city: "Bordeaux",
    country: "France",
    price: 55,
    attendees: 40,
    owner_name: "Château du Vignoble"
  },
  {
    id: "28",
    name: "Webinaire Marketing Digital",
    date: new Date(2025, 4, 15),
    formattedDate: "15/05/2025",
    city: "En ligne",
    country: "International",
    price: null,
    attendees: 450,
    owner_name: "Digital Growth Agency"
  },
  {
    id: "29",
    name: "Festival de Jazz",
    date: new Date(2025, 6, 15),
    formattedDate: "15/07/2025",
    city: "Copenhague",
    country: "Danemark",
    price: 60,
    attendees: 900,
    owner_name: "Nordic Jazz Society"
  },
  {
    id: "30",
    name: "Meetup React Developers",
    date: new Date(2025, 5, 28),
    formattedDate: "28/06/2025",
    city: "Berlin",
    country: "Allemagne",
    price: null,
    attendees: 80,
    owner_name: "React Berlin Community"
  }
];

export default function RechercheEvenementsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  // Simulation du chargement des données et préparation des événements
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const eventsWithDelay = testEvents.map((event, index) => ({
        ...event,
        animationDelay: index * 100,
      }));
      setActiveEvents(eventsWithDelay);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Application des filtres
  useEffect(() => {
    let filteredResults = testEvents;

    // Filtre par terme de recherche (uniquement nom d'événement)
    if (searchTerm) {
      filteredResults = filteredResults.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par prix
    if (priceFilter !== "all") {
      if (priceFilter === "free") {
        filteredResults = filteredResults.filter(event => event.price === 0 || event.price === null);
      } else if (priceFilter === "low") {
        filteredResults = filteredResults.filter(event => event.price !== null && event.price > 0 && event.price <= 20);
      } else if (priceFilter === "medium") {
        filteredResults = filteredResults.filter(event => event.price !== null && event.price > 20 && event.price <= 50);
      } else if (priceFilter === "high") {
        filteredResults = filteredResults.filter(event => event.price !== null && event.price > 50);
      }
    }

    // Filtre par pays
    if (countryFilter !== "all") {
      filteredResults = filteredResults.filter(event =>
        event.country === countryFilter
      );
    }

    // Filtre par date
    if (dateFilter !== "all") {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      const nextThreeMonths = new Date();
      nextThreeMonths.setMonth(today.getMonth() + 3);

      if (dateFilter === "thisMonth") {
        filteredResults = filteredResults.filter(event =>
          event.date >= today && event.date < nextMonth
        );
      } else if (dateFilter === "nextThreeMonths") {
        filteredResults = filteredResults.filter(event =>
          event.date >= today && event.date < nextThreeMonths
        );
      } else if (dateFilter === "later") {
        filteredResults = filteredResults.filter(event =>
          event.date >= nextThreeMonths
        );
      }
    }

    // Ajouter le délai d'animation et mettre à jour l'état
    const resultsWithDelay = filteredResults.map((event, index) => ({
      ...event,
      animationDelay: index * 100,
    }));

    setActiveEvents(resultsWithDelay);
    setCurrentPage(1); // Réinitialiser à la première page lors d'un changement de filtre
  }, [searchTerm, priceFilter, countryFilter, dateFilter]);

  // Calcul des événements à afficher pour la pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = activeEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(activeEvents.length / eventsPerPage);

  // Liste des pays uniques pour le filtre
  const uniqueCountries = [...new Set(testEvents.map(event => event.country))];

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header avec recherche et filtres */}
      <div
        className="mb-8 opacity-0 animate-fadeIn"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Découvrir des événements
        </h1>

        {/* Barre de recherche pour le nom de l'événement uniquement */}
        <div className="relative max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Rechercher un événement par nom..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Filtre de prix */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-neutral-800 border border-neutral-700">
                Prix: {priceFilter === "all" ? "Tous" :
                priceFilter === "free" ? "Gratuit" :
                  priceFilter === "low" ? "< 20€" :
                    priceFilter === "medium" ? "20-50€" : "> 50€"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtre de prix"
              onAction={(key) => setPriceFilter(key as string)}
              className="bg-neutral-800 text-white"
            >
              <DropdownItem key="all">Tous les prix</DropdownItem>
              <DropdownItem key="free">Gratuit</DropdownItem>
              <DropdownItem key="low">Moins de 20€</DropdownItem>
              <DropdownItem key="medium">20€ à 50€</DropdownItem>
              <DropdownItem key="high">Plus de 50€</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Filtre de pays */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-neutral-800 border border-neutral-700">
                Pays: {countryFilter === "all" ? "Tous" : countryFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtre de pays"
              onAction={(key) => setCountryFilter(key as string)}
              className="bg-neutral-800 text-white"
            >
              <DropdownItem key="all">Tous les pays</DropdownItem>
              {uniqueCountries.map(country => (
                <DropdownItem key={country}>{country}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Filtre de date */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-neutral-800 border border-neutral-700">
                Date: {dateFilter === "all" ? "Toutes" :
                dateFilter === "thisMonth" ? "Ce mois-ci" :
                  dateFilter === "nextThreeMonths" ? "Trois prochains mois" : "Plus tard"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtre de date"
              onAction={(key) => setDateFilter(key as string)}
              className="bg-neutral-800 text-white"
            >
              <DropdownItem key="all">Toutes les dates</DropdownItem>
              <DropdownItem key="thisMonth">Ce mois-ci</DropdownItem>
              <DropdownItem key="nextThreeMonths">Trois prochains mois</DropdownItem>
              <DropdownItem key="later">Plus tard</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Résultats de recherche */}
        <p className="text-center text-gray-400 mb-6">
          {activeEvents.length} événement{activeEvents.length !== 1 ? 's' : ''} trouvé{activeEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Affichage du chargement */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      )}

      {/* Message si aucun événement trouvé */}
      {!isLoading && activeEvents.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="text-xl">Aucun événement ne correspond à vos critères</p>
          <p className="mt-2">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}

      {/* Grille d'événements avec animations */}
      {!isLoading && activeEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden rounded-lg flex flex-col opacity-0 animate-slideUp cursor-pointer"
              style={{
                animationDelay: `${event.animationDelay}ms`,
                animationFillMode: "forwards",
                transform:
                  hoveredId === event.id ? "translateY(-8px)" : "translateY(0)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow:
                  hoveredId === event.id
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                    : "none",
              }}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Zone 1: Image/Visualisation de l'événement */}
              <div className="bg-neutral-800 h-36 flex items-center justify-center overflow-hidden relative">
                <div
                  className={`w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center relative ${
                    hoveredId === event.id ? "animate-pulse" : ""
                  }`}
                >
                  {hoveredId === event.id && (
                    <div className="absolute inset-0 bg-neutral-700 rounded-full animate-ripple"></div>
                  )}
                  <div className="w-6 h-6 bg-neutral-600 rounded-full relative z-10"></div>
                </div>

                {/* Effet visuel pour le prix */}
                {event.price !== null && event.price > 0 && (
                  <Tooltip content={`${event.price}€`} placement="top">
                    <div className="absolute top-2 right-2 bg-violet-900 text-white text-xs px-2 py-1 rounded-full">
                      Payant
                    </div>
                  </Tooltip>
                )}

                {(event.price === 0 || event.price === null) && (
                  <div className="absolute top-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded-full">
                    Gratuit
                  </div>
                )}

                {/* Effet de particules lors du survol */}
                {hoveredId === event.id && (
                  <div className="absolute inset-0 bg-neutral-800">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-neutral-600 rounded-full animate-floatingParticle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDuration: `${Math.random() * 2 + 2}s`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: Math.random() * 0.5 + 0.1,
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Zone 2: Informations de l'événement */}
              <div className="bg-neutral-900 p-5 flex-grow h-36 flex flex-col justify-center">
                <h2
                  className="text-xl font-medium text-white mb-2 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === event.id
                        ? "translateX(6px)"
                        : "translateX(0)",
                  }}
                >
                  {event.name}
                </h2>
                <p
                  className="text-sm text-gray-400 mb-1 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === event.id
                        ? "translateX(3px)"
                        : "translateX(0)",
                  }}
                >
                  {event.formattedDate} • {event.city}, {event.country}
                </p>
                <div className="flex justify-between">
                  <p
                    className="text-sm text-gray-400 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === event.id
                          ? "translateX(3px)"
                          : "translateX(0)",
                    }}
                  >
                    {event.attendees} participant{event.attendees !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-violet-400">
                    {event.price !== null ? `${event.price}€` : 'Gratuit'}
                  </p>
                </div>
                <p
                  className="text-xs text-gray-500 mt-2 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === event.id
                        ? "translateX(3px)"
                        : "translateX(0)",
                  }}
                >
                  Organisé par {event.owner_name}
                </p>
              </div>

              {/* Zone 3: Bouton détails */}
              <div className="bg-neutral-950 relative overflow-hidden group">
                <div
                  className="absolute inset-0 bg-violet-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ transform: "skewX(-15deg) translateX(-10%)" }}
                ></div>
                <div className="p-3 text-center relative z-10">
                  <Link href={`/evenement/${event.id}`}>
                    <button
                      className={`text-sm transition-all duration-300 relative ${
                        hoveredId === event.id
                          ? "text-violet-400 font-medium"
                          : "text-white"
                      }`}
                    >
                      <span className="relative z-10">Voir les détails</span>
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full"
                        style={{ opacity: hoveredId === event.id ? 1 : 0 }}
                      ></span>
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            size="sm"
            variant="flat"
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="bg-neutral-800"
          >
            &lt;
          </Button>

          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              size="sm"
              variant={currentPage === index + 1 ? "solid" : "flat"}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "bg-violet-700" : "bg-neutral-800"}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            size="sm"
            variant="flat"
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="bg-neutral-800"
          >
            &gt;
          </Button>
        </div>
      )}

      {/* Styles pour les animations personnalisées */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes floatingParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px)
              translateX(${Math.random() > 0.5 ? "+" : "-"}20px);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }

        .animate-ripple {
          animation: ripple 1.5s infinite;
        }

        .animate-floatingParticle {
          animation: floatingParticle 3s infinite;
        }
      `}</style>
    </div>
  );
}