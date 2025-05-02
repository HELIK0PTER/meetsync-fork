"use client";

import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Card } from "@heroui/card"
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

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

export default function RechercheEvenementsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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

  const supabase = createClient();

  // Récupérer les événements depuis la base de données
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      } else {
        // Formater les dates pour l'affichage
        const formattedEvents = data.map(event => {
          const eventDate = new Date(event.date);
          return {
            ...event,
            date: eventDate,
            formattedDate: eventDate.toLocaleDateString('fr-FR')
          };
        });
        setEvents(formattedEvents);
      }
    };
    fetchEvents();
  }, []);

  // Simulation du chargement des données et préparation des événements
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const eventsWithDelay = events.map((event, index) => ({
        ...event,
        animationDelay: index * 100,
      }));
      setActiveEvents(eventsWithDelay);
      setIsLoading(false);
    }, 1000);
  }, [events]);

  // Application des filtres
  useEffect(() => {
    let filteredResults = events;

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
  }, [searchTerm, priceFilter, countryFilter, dateFilter, events]);

  // Calcul des événements à afficher pour la pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = activeEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(activeEvents.length / eventsPerPage);

  // Liste des pays uniques pour le filtre
  const uniqueCountries = Array.from(new Set(events.map(event => event.country)));

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
              items={[
                { key: "all", label: "Tous les pays" },
                ...uniqueCountries.map(country => ({ key: country, label: country }))
              ]}
            >
              <></>
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