"use client";

import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useState, useEffect, useLayoutEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Type for events fetched from the "all_events" view
type Event = {
  id: string;
  name: string;
  date: string;
  formattedDate: string;
  city: string;
  country: string;
  price: number | null;
  attendees: number;
  owner_name: string | null;
  animationDelay?: number;
};

export default function RechercheEvenementsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = 9;
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("all_events")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      } else {
        const formattedEvents = data.map((event) => {
          const eventDate = new Date(event.date);
          return {
            ...event,
            date: eventDate.toISOString(),
            formattedDate: eventDate.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          };
        });
        setEvents(formattedEvents);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const eventsWithDelay = events.map((event, index) => ({
          ...event,
          animationDelay: index * 100,
        }));
        setActiveEvents(eventsWithDelay);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [events]);

  useEffect(() => {
    let filteredResults = events;

    if (searchTerm) {
      filteredResults = filteredResults.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      if (priceFilter === "free") {
        filteredResults = filteredResults.filter(
          (event) => event.price === 0 || event.price === null
        );
      } else if (priceFilter === "low") {
        filteredResults = filteredResults.filter(
          (event) =>
            event.price !== null && event.price > 0 && event.price <= 20
        );
      } else if (priceFilter === "medium") {
        filteredResults = filteredResults.filter(
          (event) =>
            event.price !== null && event.price > 20 && event.price <= 50
        );
      } else if (priceFilter === "high") {
        filteredResults = filteredResults.filter(
          (event) => event.price !== null && event.price > 50
        );
      }
    }

    if (countryFilter !== "all") {
      filteredResults = filteredResults.filter(
        (event) => event.country === countryFilter
      );
    }

    if (dateFilter !== "all") {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      const nextThreeMonths = new Date();
      nextThreeMonths.setMonth(today.getMonth() + 3);

      filteredResults = filteredResults.filter((event) => {
        const eventDate = new Date(event.date);
        if (dateFilter === "thisMonth") {
          return eventDate >= today && eventDate < nextMonth;
        } else if (dateFilter === "nextThreeMonths") {
          return eventDate >= today && eventDate < nextThreeMonths;
        } else if (dateFilter === "later") {
          return eventDate >= nextThreeMonths;
        }
        return true;
      });
    }

    const resultsWithDelay = filteredResults.map((event, index) => ({
      ...event,
      animationDelay: index * 100,
    }));

    setActiveEvents(resultsWithDelay);
    setCurrentPage(1);
  }, [searchTerm, priceFilter, countryFilter, dateFilter, events]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = activeEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(activeEvents.length / eventsPerPage);

  const uniqueCountries = Array.from(
    new Set(events.map((event) => event.country))
  );

  useLayoutEffect(() => {
    const header = document.querySelector(".header-container") as HTMLElement;
    if (header) {
      header.style.animation = "fadeIn 0.8s ease-out forwards";
      header.style.animationDelay = "200ms";
    }
  }, []);

  return (
    <div className="page-container">
      {/* Header avec recherche et filtres */}
      <div className="header-container">
        <h1 className="page-title">Découvrir des événements</h1>

        {/* Barre de recherche pour le nom de l'événement uniquement */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un événement par nom..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Filtre de prix */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-neutral-800 border border-neutral-700"
              >
                Prix:{" "}
                {priceFilter === "all"
                  ? "Tous"
                  : priceFilter === "free"
                    ? "Gratuit"
                    : priceFilter === "low"
                      ? "< 20€"
                      : priceFilter === "medium"
                        ? "20-50€"
                        : "> 50€"}
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
              <Button
                variant="flat"
                className="bg-neutral-800 border border-neutral-700"
              >
                Pays: {countryFilter === "all" ? "Tous" : countryFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtre de pays"
              onAction={(key) => setCountryFilter(key as string)}
              className="bg-neutral-800 text-white"
              items={[
                { key: "all", label: "Tous les pays" },
                ...uniqueCountries.map((country) => ({
                  key: country,
                  label: country,
                })),
              ]}
            >
              <></>
            </DropdownMenu>
          </Dropdown>

          {/* Filtre de date */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-neutral-800 border border-neutral-700"
              >
                Date:{" "}
                {dateFilter === "all"
                  ? "Toutes"
                  : dateFilter === "thisMonth"
                    ? "Ce mois-ci"
                    : dateFilter === "nextThreeMonths"
                      ? "Trois prochains mois"
                      : "Plus tard"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtre de date"
              onAction={(key) => setDateFilter(key as string)}
              className="bg-neutral-800 text-white"
            >
              <DropdownItem key="all">Toutes les dates</DropdownItem>
              <DropdownItem key="thisMonth">Ce mois-ci</DropdownItem>
              <DropdownItem key="nextThreeMonths">
                Trois prochains mois
              </DropdownItem>
              <DropdownItem key="later">Plus tard</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Résultats de recherche */}
        <p className="text-center text-gray-400 mb-6">
          {activeEvents.length} événement{activeEvents.length !== 1 ? "s" : ""}{" "}
          trouvé{activeEvents.length !== 1 ? "s" : ""}
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
          <p className="text-xl">
            Aucun événement ne correspond à vos critères
          </p>
          <p className="mt-2">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}

      {/* Grille d'événements avec animations */}
      {!isLoading && activeEvents.length > 0 && (
        <div className="events-grid">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="event-card animate-slideUp"
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
              <div className="event-card-image">
                <div
                  className={`w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center relative ${hoveredId === event.id ? "animate-pulse" : ""}`}
                >
                  {hoveredId === event.id && (
                    <div className="absolute inset-0 bg-neutral-700 rounded-full animate-ripple"></div>
                  )}
                  <div className="w-6 h-6 bg-neutral-600 rounded-full relative z-10"></div>
                </div>

                {/* Badge de prix */}
                {event.price !== null && event.price > 0 && (
                  <div className="event-card-badge">{event.price}€</div>
                )}

                {(event.price === 0 || event.price === null) && (
                  <div className="event-card-badge free">Gratuit</div>
                )}
              </div>

              {/* Zone 2: Informations de l'événement */}
              <div className="event-card-content">
                <h2 className="event-card-title">{event.name}</h2>
                <p className="event-card-details">
                  {event.formattedDate} • {event.city}, {event.country}
                </p>
                <p className="event-card-owner">
                  {event.owner_name && (
                    <span className="text-white">Organisé par</span>
                  )}{" "}
                  {event.owner_name}
                </p>
                <div className="event-card-footer">
                  <p className="event-card-participants">
                    {event.attendees} participant
                    {event.attendees !== 1 ? "s" : ""}
                  </p>
                  <p className="event-card-price">
                    {event.price !== null ? `${event.price}€` : "Gratuit"}
                  </p>
                </div>
              </div>
            </div>
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              className={
                currentPage === index + 1 ? "bg-violet-700" : "bg-neutral-800"
              }
            >
              {index + 1}
            </Button>
          ))}

          <Button
            size="sm"
            variant="flat"
            isDisabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-neutral-800"
          >
            &gt;
          </Button>
        </div>
      )}

      {/* Styles pour les animations personnalisées */}
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background-color: black;
          padding: 1.5rem;
        }

        .header-container {
          margin-bottom: 2rem;
          opacity: 0;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: white;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .search-container {
          position: relative;
          max-width: 28rem;
          margin: 0 auto 1.5rem;
        }

        .search-input {
          width: 100%;
          background-color: rgb(23 23 23);
          border: 1px solid rgb(55 65 81);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: white;
        }

        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 0.625rem;
          color: rgb(156 163 175);
        }
      `}</style>

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
            transform: translateY(-40px) translateX(20px);
            opacity: 0;
          }
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

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .page-container {
          min-height: 100vh;
          background-color: black;
          padding: 1.5rem;
        }

        .header-container {
          margin-bottom: 2rem;
          opacity: 0;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: white;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .search-container {
          position: relative;
          max-width: 28rem;
          margin: 0 auto 1.5rem;
        }

        .search-input {
          width: 100%;
          background-color: rgb(23 23 23);
          border: 1px solid rgb(55 65 81);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: white;
        }

        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 0.625rem;
          color: rgb(156 163 175);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .events-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .events-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .event-card {
          overflow: hidden;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          opacity: 0;
          cursor: pointer;
          background: linear-gradient(145deg, rgb(23 23 23), rgb(38 38 38));
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.2);
          border-color: rgba(167, 139, 250, 0.3);
        }

        .event-card-image {
          background: linear-gradient(145deg, rgb(38 38 38), rgb(23 23 23));
          height: 12rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-card-content {
          background: transparent;
          padding: 1.5rem;
          flex-grow: 1;
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .event-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .event-card-details {
          font-size: 0.875rem;
          color: rgb(156 163 175);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .event-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-card-price {
          font-size: 0.875rem;
          color: rgb(167 139 250);
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          background: rgba(167, 139, 250, 0.1);
          border-radius: 9999px;
        }

        .event-card-participants {
          font-size: 0.875rem;
          color: rgb(156 163 175);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .event-card-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(145deg, rgb(88 28 135), rgb(109 40 217));
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .event-card-badge.free {
          background: linear-gradient(145deg, rgb(20 83 45), rgb(34 197 94));
        }

        .event-card-owner {
          font-size: 0.875rem;
          color: rgb(156 163 175);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </div>
  );
}
