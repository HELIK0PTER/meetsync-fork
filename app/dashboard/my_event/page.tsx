// app/mes-evenements/page.tsx
"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Définition du type pour les événements
type Event = {
  id: string;
  event_name: string;
  event_date: string;
  country: string;
  city: string;
  rue: string;
  price: number | null;
  owner_id: string;
  has_reminder: boolean;
  animationDelay?: number;
  banner_url?: string;
};

export default function MesEvenementsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Utilisateur connecté:', user);
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) return;

      try {
        const { data: userEvents, error: userEventsError } = await supabase
          .from('event')
          .select('*')
          .eq('owner_id', userId)
          .order('event_date', { ascending: true });

        if (userEventsError) {
          console.error('Erreur Supabase (événements utilisateur):', userEventsError);
          throw userEventsError;
        }

        console.log('Événements de l\'utilisateur:', userEvents);
        const eventsWithDelay = userEvents.map((event, index) => ({
          ...event,
          animationDelay: index * 100,
        }));
        setActiveEvents(eventsWithDelay);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId, supabase]);

  // Filtrage des événements pour la recherche
  const filteredEvents = activeEvents.filter((event) =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center m-auto w-full pb-10 h-full pt-10 min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header avec recherche et animations */}
      <div
        className="mb-8 opacity-0 animate-fadeIn"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Mes Événements
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

      {/* Affichage du chargement */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Message si aucun événement trouvé */}
      {!isLoading && filteredEvents.length === 0 && (
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
          <p className="text-xl">Aucun événement trouvé</p>
          <p className="mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Grille d'événements avec animations */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden rounded-lg flex flex-col animate-slideUp cursor-pointer"
              style={{
                filter: hoveredId === event.id ? "none" : "grayscale(100%)",
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
              {/* Zone 1: Bannière ou fond violet */}
              <div className="bg-neutral-800 h-36 flex items-center justify-center overflow-hidden relative rounded-t-lg">
                {event.banner_url ? (
                  <Image
                    src={event.banner_url}
                    alt="Bannière"
                    className="w-full h-full object-cover"
                    style={{ minHeight: 120, maxHeight: 160 }}
                    width={1000}
                    height={1000}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-violet-700 to-violet-500"></div>
                )}
  
                {/* Effet de particules lors du survol */}
                {hoveredId === event.id && (
                  <div className="absolute inset-0 bg-transparent pointer-events-none" style={{ filter: 'none' }}>
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-violet-400 shadow-lg rounded-full animate-floatingParticle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDuration: `${Math.random() * 2 + 2}s`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: Math.random() * 0.5 + 0.5,
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
                  {event.event_name}
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
                  {new Date(event.event_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
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
                  {event.city}, {event.country}
                </p>
              </div>

              {/* Zone 3: View Details avec effet de glissement */}
              <div className="bg-neutral-950 relative overflow-hidden group">
                <div
                  className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ transform: "skewX(-15deg) translateX(-10%)" }}
                ></div>
                <div className="p-3 text-center relative z-10">
                  <Link href={`/dashboard/my_event/${event.id}`}>
                    <button
                      className={`text-sm transition-all duration-300 relative ${
                        hoveredId === event.id
                          ? "text-blue-400 font-medium"
                          : "text-white"
                      }`}
                    >
                      <span className="relative z-10">Voir les détails</span>
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
      )}

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

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
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