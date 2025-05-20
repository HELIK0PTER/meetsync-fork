"use client";
import { Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function EventList({ events, title }: { events: any[]; title: string }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-violet-400">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            href={`/dashboard/my_event/${event.id}`}
            key={event.id}
            className="block"
          >
            <Card className="relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:ring-2 hover:ring-violet-500">
              <div className="relative h-48 w-full">
                {event.banner_url && event.banner_url !== "/default-event.jpg" ? (
                  <Image
                    src={event.banner_url}
                    alt={event.event_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <span className="absolute w-24 h-24 rounded-full bg-gray-400 opacity-70" />
                    <span className="absolute w-16 h-16 rounded-full bg-gray-700 opacity-80" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {event.event_name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {new Date(event.event_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-2">
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
                    <span className="text-sm text-gray-300">{event.city || "Lieu non spécifié"}</span>
                  </div>

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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm text-gray-300">Organisé par {event.profiles?.display_name || "Anonyme"}</span>
                  </div>

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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className={`text-sm ${event.is_public ? "text-green-400" : "text-purple-400"}`}>{event.is_public ? "Événement public" : "Événement privé"}</span>
                  </div>

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
                    <span className="text-sm text-gray-300">
                      {event.price === null || event.price === 0 ? (
                        <span className="text-green-400">Gratuit</span>
                      ) : (
                        `${event.price.toFixed(2)}€`
                      )}
                    </span>
                  </div>
                  {(event.waiting_count !== undefined || event.accepted_count !== undefined || event.refused_count !== undefined) && (
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
                      <span className="text-sm">
                        {event.waiting_count > 0 && (
                          <span className="text-yellow-400">{event.waiting_count} en attente</span>
                        )}
                        {event.accepted_count > 0 && (
                          <span className="text-green-400">{event.accepted_count > 0 && event.waiting_count > 0 && ", "}{event.accepted_count} accepté{event.accepted_count !== 1 ? "s" : ""}</span>
                        )}
                        {event.refused_count > 0 && (
                          <span className="text-red-400">{(event.accepted_count > 0 || event.waiting_count > 0) && ", "}{event.refused_count} refusé{event.refused_count !== 1 ? "s" : ""}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 