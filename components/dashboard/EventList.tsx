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
            <Card className="relative overflow-hidden rounded-2xl bg-neutral-900 shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 w-full flex items-center justify-center bg-neutral-800">
                {event.banner_url ? (
                  <Image
                    src={event.banner_url}
                    alt={event.event_name || event.name || 'Événement'}
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
                <h2 className="text-xl font-bold text-white mb-0 truncate">{event.event_name || event.name || 'Sans titre'}</h2>
                <p className="text-gray-300 text-sm mb-2">{event.event_date ? new Date(event.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ''}</p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{event.city || 'Ville non spécifiée'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>Organisé par {event.profiles?.display_name || event.owner_name || 'Anonyme'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className={event.price === 0 || event.price === null ? 'text-green-400' : 'text-violet-400'}>
                    {event.price === 0 || event.price === null ? 'Gratuit' : `${event.price}€`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span>{typeof event.attendees === 'number' ? event.attendees : 0} participant{event.attendees === 1 ? '' : 's'}</span>
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
    </div>
  );
} 