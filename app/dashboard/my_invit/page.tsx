// app/mes-invitations/page.tsx
"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Définition du type pour les invitations
interface Invitation {
  // Champs de l'invite
  invite_id: string;
  invite_created_at: string;
  event_id: string;
  status: string;
  must_pay: boolean;
  user_id: string;

  // Champs de l'événement
  event_created_at: string;
  event_name: string;
  event_date: string;
  price: number;
  city: string;
  banner_url: string;
  max_attendees: number;

  // Infos supplémentaires
  attendee_count: number;
}

export default function MesInvitationsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeInvitations, setActiveInvitations] = useState<Invitation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "accept" | "refused"
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("my_invites")
        .select("*")
        .order("invite_created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des invitations:", error);
      } else {
        setActiveInvitations(data as Invitation[]);
      }
      setIsLoading(false);
    };
    fetchInvitations();
  }, [supabase]);

  const filteredInvitations = activeInvitations.filter((invitation) => {
    const matchesSearch = invitation.event_name
      ? invitation.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesStatus =
      statusFilter === "all" || invitation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Invitation["status"]) => {
    switch (status) {
      case "waiting":
        return "text-yellow-400 group-hover:text-yellow-300";
      case "accept":
        return "text-green-400 group-hover:text-green-300";
      case "refused":
        return "text-red-400 group-hover:text-red-300";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: Invitation["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <svg
            className="w-4 h-4 inline-block mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "accept":
        return (
          <svg
            className="w-4 h-4 inline-block mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "refused":
        return (
          <svg
            className="w-4 h-4 inline-block mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non spécifiée";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Mes Invitations
        </h1>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une invitation..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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

          <div className="flex gap-4 mt-4 justify-center">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                statusFilter === "all"
                  ? "bg-purple-600 text-white scale-105 ring-2 ring-purple-500"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:scale-105 hover:ring-2 hover:ring-purple-500"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              Toutes les invitations
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                statusFilter === "waiting"
                  ? "bg-yellow-500 text-white scale-105 ring-2 ring-yellow-400"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:scale-105 hover:ring-2 hover:ring-yellow-400"
              }`}
              onClick={() => setStatusFilter("waiting")}
            >
              En attente
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                statusFilter === "accept"
                  ? "bg-green-500 text-white scale-105 ring-2 ring-green-400"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:scale-105 hover:ring-2 hover:ring-green-400"
              }`}
              onClick={() => setStatusFilter("accept")}
            >
              Acceptées
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                statusFilter === "refused"
                  ? "bg-red-500 text-white scale-105 ring-2 ring-red-400"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:scale-105 hover:ring-2 hover:ring-red-400"
              }`}
              onClick={() => setStatusFilter("refused")}
            >
              Refusées
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-xl text-gray-400 py-16">
            Chargement des invitations...
          </div>
        ) : filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => (
            <Link
              href={`/dashboard/my_event/${invitation.event_id}`}
              key={invitation.invite_id}
              className="block transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-purple-500 rounded-lg"
            >
              <Card
                className="overflow-hidden rounded-lg flex flex-col bg-neutral-900 hover:bg-neutral-800/50 transition-all duration-300 group h-full"
                onMouseEnter={() => setHoveredId(invitation.invite_id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-48 bg-neutral-800">
                  {invitation.banner_url ? (
                    <img
                      src={invitation.banner_url}
                      alt={invitation.event_name || "Événement"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center">
                        <div className="w-6 h-6 bg-neutral-600 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-grow">
                  <h2
                    className="text-xl font-medium text-white mb-2 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === invitation.invite_id
                          ? "translateX(8px)"
                          : "translateX(0)",
                    }}
                  >
                    {invitation.event_name || "Sans titre"}
                  </h2>
                  <p
                    className="text-sm text-gray-400 mb-1 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === invitation.invite_id
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  >
                    {formatDate(invitation.event_date)}
                  </p>
                  <p
                    className="text-sm text-gray-400 mb-1 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === invitation.invite_id
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">
                        {invitation.city || "Lieu non spécifié"}
                      </span>
                    </div>
                  </p>
                  <p
                    className="text-sm text-gray-400 mb-2 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === invitation.invite_id
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {invitation.price === null || invitation.price === 0 ? (
                        <span className="text-green-400">Gratuit</span>
                      ) : (
                        <span>{invitation.price.toFixed(2)}€</span>
                      )}
                    </div>
                  </p>
                  <p
                    className="text-sm text-gray-400 mb-2 transition-all duration-300"
                    style={{
                      transform:
                        hoveredId === invitation.invite_id
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>
                        {invitation.attendee_count} / {invitation.max_attendees} <span className="text-gray-400 text-sm">participants</span>
                      </span>
                    </div>
                  </p>
                  <div
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg
                      ${getStatusColor(invitation.status)}
                      transition-all duration-300
                    `}
                  >
                    {getStatusIcon(invitation.status)}
                    <span className="font-medium">
                      {invitation.status === "waiting" && "En attente"}
                      {invitation.status === "accept" && "Acceptée"}
                      {invitation.status === "refused" && "Refusée"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-xl text-gray-400 py-16">
            Aucune invitation trouvée
          </div>
        )}
      </div>
    </div>
  );
}
