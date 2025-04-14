// app/mes-evenements/page.tsx
"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Définition du type pour les événements
type Event = {
  id: number;
  title: string;
  date: string;
  attendees: number;
  animationDelay?: number;
};

// Liste de 10 événements factices pour l'exemple
const dummyEvents: Event[] = [
  {
    id: 1,
    title: "Tech Conference 2023",
    date: "12/05/2023",
    attendees: 100,
  },
  {
    id: 2,
    title: "Product Launch: NextGen",
    date: "01/15/2024",
    attendees: 150,
  },
  {
    id: 3,
    title: "Annual Team Retreat",
    date: "05/12/2023",
    attendees: 50,
  },
  {
    id: 4,
    title: "Developer Workshop",
    date: "03/22/2024",
    attendees: 75,
  },
  {
    id: 5,
    title: "UX Design Summit",
    date: "06/10/2024",
    attendees: 120,
  },
  {
    id: 6,
    title: "Hackathon 2024",
    date: "04/05/2024",
    attendees: 200,
  },
  {
    id: 7,
    title: "AI Conference",
    date: "07/18/2024",
    attendees: 180,
  },
  {
    id: 8,
    title: "Startup Networking",
    date: "08/30/2024",
    attendees: 90,
  },
  {
    id: 9,
    title: "Cloud Summit 2024",
    date: "09/15/2024",
    attendees: 135,
  },
  {
    id: 10,
    title: "Tech Hiring Fair",
    date: "10/22/2024",
    attendees: 250,
  },
];

export default function MesEvenementsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Animation d'entrée lors du chargement de la page
  useEffect(() => {
    const eventsWithDelay = dummyEvents.map((event, index) => ({
      ...event,
      animationDelay: index * 100,
    }));
    setActiveEvents(eventsWithDelay);
  }, []);

  // Filtrage des événements pour la recherche
  const filteredEvents = activeEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header avec recherche et animations */}
      <div
        className="mb-8 opacity-0 animate-fadeIn"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Événements
        </h1>
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher un événement..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
      </div>

      {/* Grille d'événements avec animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden rounded-lg flex flex-col opacity-0 animate-slideUp cursor-pointer"
            style={{
              filter: "grayscale(100%)",
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
            {/* Zone 1: Photo avec effet pulsation */}
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

            {/* Zone 2: Informations avec effet de survol */}
            <div className="bg-neutral-900 p-5 flex-grow h-32 flex flex-col justify-center">
              <h2
                className="text-xl font-medium text-white mb-2 transition-all duration-300"
                style={{
                  transform:
                    hoveredId === event.id
                      ? "translateX(6px)"
                      : "translateX(0)",
                }}
              >
                {event.title}
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
                {event.date}
              </p>
              <p
                className="text-sm text-gray-400 transition-all duration-300"
                style={{
                  transform:
                    hoveredId === event.id
                      ? "translateX(3px)"
                      : "translateX(0)",
                }}
              >
                {event.attendees} attendees
              </p>
            </div>

            {/* Zone 3: View Details avec effet de glissement */}
            <div className="bg-neutral-950 relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ transform: "skewX(-15deg) translateX(-10%)" }}
              ></div>
              <div className="p-3 text-center relative z-10">
                <Link href={`/evenement/${event.id}`}>
                  <button
                    className={`text-sm transition-all duration-300 relative ${
                      hoveredId === event.id
                        ? "text-blue-400 font-medium"
                        : "text-white"
                    }`}
                  >
                    <span className="relative z-10">View Details</span>
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"
                      style={{ opacity: hoveredId === event.id ? 1 : 0 }}
                    ></span>
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
