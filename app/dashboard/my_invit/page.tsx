// app/mes-invitations/page.tsx
"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Définition du type pour les invitations
type Invitation = {
  id: number;
  title: string;
  date: string;
  attendees: number;
  status: "pending" | "accepted" | "refused";
  animationDelay?: number;
};

// Liste de 10 invitations factices avec statut
const dummyInvitations: Invitation[] = [
  {
    id: 1,
    title: "Tech Conference 2023",
    date: "12/05/2023",
    attendees: 100,
    status: "pending",
  },
  {
    id: 2,
    title: "Product Launch: NextGen",
    date: "01/15/2024",
    attendees: 150,
    status: "accepted",
  },
  {
    id: 3,
    title: "Annual Team Retreat",
    date: "05/12/2023",
    attendees: 50,
    status: "refused",
  },
  {
    id: 4,
    title: "Developer Workshop",
    date: "03/22/2024",
    attendees: 75,
    status: "accepted",
  },
  {
    id: 5,
    title: "UX Design Summit",
    date: "06/10/2024",
    attendees: 120,
    status: "pending",
  },
  {
    id: 6,
    title: "Hackathon 2024",
    date: "04/05/2024",
    attendees: 200,
    status: "refused",
  },
  {
    id: 7,
    title: "AI Conference",
    date: "07/18/2024",
    attendees: 180,
    status: "accepted",
  },
  {
    id: 8,
    title: "Startup Networking",
    date: "08/30/2024",
    attendees: 90,
    status: "pending",
  },
  {
    id: 9,
    title: "Cloud Summit 2024",
    date: "09/15/2024",
    attendees: 135,
    status: "refused",
  },
  {
    id: 10,
    title: "Tech Hiring Fair",
    date: "10/22/2024",
    attendees: 250,
    status: "accepted",
  },
];

export default function MesInvitationsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [activeInvitations, setActiveInvitations] = useState<Invitation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "refused">("all");

  useEffect(() => {
    const invitationsWithDelay = dummyInvitations.map((invitation, index) => ({
      ...invitation,
      animationDelay: index * 100,
    }));
    setActiveInvitations(invitationsWithDelay);
  }, []);

  const filteredInvitations = activeInvitations.filter((invitation) => {
    // Filtre par terme de recherche
    const matchesSearch = invitation.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut
    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Invitation["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "accepted":
        return "text-green-400";
      case "refused":
        return "text-red-400";
    }
  };

  const getStatusIcon = (status: Invitation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <svg className="w-4 h-4 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "accepted":
        return (
          <svg className="w-4 h-4 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "refused":
        return (
          <svg className="w-4 h-4 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div
        className="mb-8 opacity-0 animate-fadeIn"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Mes Invitations
        </h1>

        {/* Zone de recherche et filtres dans un conteneur flexbox */}
        <div className="max-w-6xl mx-auto">
          {/* Barre de recherche */}
          <div className="mb-4 w-full max-w-sm mx-auto md:mx-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une invitation..."
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

          {/* Filtres de statut */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              Toutes les invitations
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
              onClick={() => setStatusFilter("pending")}
            >
              En attente
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "accepted"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
              onClick={() => setStatusFilter("accepted")}
            >
              Acceptées
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === "refused"
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
              onClick={() => setStatusFilter("refused")}
            >
              Refusées
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => (
            <Card
              key={invitation.id}
              className="overflow-hidden rounded-lg flex flex-col opacity-0 animate-slideUp cursor-pointer"
              style={{
                animationDelay: `${invitation.animationDelay}ms`,
                animationFillMode: "forwards",
                transform:
                  hoveredId === invitation.id ? "translateY(-8px)" : "translateY(0)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow:
                  hoveredId === invitation.id
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                    : "none",
              }}
              onMouseEnter={() => setHoveredId(invitation.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Zone 1: Visuel */}
              <div className="bg-neutral-800 h-36 flex items-center justify-center overflow-hidden relative">
                <div
                  className={`w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center relative ${
                    hoveredId === invitation.id ? "animate-pulse" : ""
                  }`}
                >
                  {hoveredId === invitation.id && (
                    <div className="absolute inset-0 bg-neutral-700 rounded-full animate-ripple"></div>
                  )}
                  <div className="w-6 h-6 bg-neutral-600 rounded-full relative z-10"></div>
                </div>

                {hoveredId === invitation.id && (
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

              {/* Zone 2: Infos */}
              <div className="bg-neutral-900 p-5 flex-grow h-40 flex flex-col justify-center">
                <h2
                  className="text-xl font-medium text-white mb-2 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === invitation.id ? "translateX(6px)" : "translateX(0)",
                  }}
                >
                  {invitation.title}
                </h2>
                <p
                  className="text-sm text-gray-400 mb-1 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === invitation.id ? "translateX(3px)" : "translateX(0)",
                  }}
                >
                  {invitation.date}
                </p>
                <p
                  className="text-sm text-gray-400 mb-2 transition-all duration-300"
                  style={{
                    transform:
                      hoveredId === invitation.id ? "translateX(3px)" : "translateX(0)",
                  }}
                >
                  {invitation.attendees} participants
                </p>
                <div
                  className={`text-sm font-medium flex items-center transition-all duration-300 ${getStatusColor(invitation.status)}`}
                  style={{
                    transform:
                      hoveredId === invitation.id ? "translateX(3px)" : "translateX(0)",
                  }}
                >
                  {getStatusIcon(invitation.status)}
                  <span className="capitalize">{invitation.status}</span>
                </div>
              </div>

              {/* Zone 3: View Details */}
              <div className="bg-neutral-950 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ transform: "skewX(-15deg) translateX(-10%)" }}
                ></div>
                <div className="p-3 text-center relative z-10">
                  <Link href={`/invitation/${invitation.id}`}>
                    <button
                      className="text-sm px-4 py-1 rounded-md transition-all duration-300 relative text-white hover:text-blue-400"
                      onMouseEnter={() => setHoveredButton(invitation.id)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      <span className="relative z-10">Voir les détails</span>
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300"
                        style={{
                          width: hoveredButton === invitation.id ? '100%' : '0%',
                          opacity: hoveredButton === invitation.id ? 1 : 0
                        }}
                      ></span>
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-xl text-gray-400 py-16">
            Aucune invitation ne correspond à votre recherche
          </div>
        )}
      </div>

      {/* Animations globales */}
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