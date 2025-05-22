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
  accepted_count: number;
  waiting_count: number;
  refused_count: number;
  invites?: {
    status: 'accept' | 'waiting' | 'refused';
  }[];
  profiles?: {
    display_name: string;
  };
  is_public: boolean;
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
          .select(`
            *,
            profiles:profiles!owner_id(display_name),
            invites:invite(status)
          `)
          .eq('owner_id', userId)
          .order('event_date', { ascending: true });

        if (userEventsError) {
          console.error('Erreur Supabase (événements utilisateur):', userEventsError);
          throw userEventsError;
        }

        // Calculer les compteurs pour chaque événement
        const eventsWithCounts = userEvents.map((event) => {
          const acceptedCount = event.invites?.filter((invite: { status: string }) => invite.status === 'accept').length || 0;
          const waitingCount = event.invites?.filter((invite: { status: string }) => invite.status === 'waiting').length || 0;
          const refusedCount = event.invites?.filter((invite: { status: string }) => invite.status === 'refused').length || 0;

          return {
            ...event,
            accepted_count: acceptedCount,
            waiting_count: waitingCount,
            refused_count: refusedCount,
            animationDelay: event.animationDelay
          };
        });

        setActiveEvents(eventsWithCounts);
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
      {/* Header avec recherche */}
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
            <Link
              href={`/dashboard/my_event/${event.id}`}
              key={event.id}
              className="block"
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card
                className="relative overflow-hidden rounded-2xl bg-neutral-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-violet-500"
                style={{ animationDelay: `${event.animationDelay}ms` }}
              >
                <div className="relative h-48 w-full flex items-center justify-center bg-neutral-800">
                  {event.banner_url ? (
                    <Image
                      src={event.banner_url}
                      alt={event.event_name}
                      fill
                      className="object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="block w-32 h-32 rounded-full bg-violet-600/30 flex items-center justify-center">
                        <span className="block w-16 h-16 rounded-full bg-violet-400/60"></span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-white mb-0 truncate">{event.event_name}</h2>
                  <p className="text-gray-300 text-sm mb-2">{event.event_date ? new Date(event.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ''}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{event.city || 'Ville non spécifiée'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className={event.price === 0 || event.price === null ? 'text-green-400' : 'text-violet-400'}>
                      {event.price === 0 || event.price === null ? 'Gratuit' : `${event.price}€`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span>{typeof event.accepted_count === 'number' ? event.accepted_count : 0} participant{event.accepted_count === 1 ? '' : 's'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className={event.is_public ? 'text-green-400' : 'text-purple-400'}>
                      {event.is_public ? 'Événement public' : 'Événement privé'}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
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

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}