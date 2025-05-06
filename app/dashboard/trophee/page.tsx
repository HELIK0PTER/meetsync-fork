import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

function getUniqueCities(events: any[]): string[] {
  const cities = events.map((e: any) => e.city).filter(Boolean);
  return Array.from(new Set(cities));
}

function getSameNameEvents(events: any[]): number {
  const nameCount: Record<string, number> = events.reduce((acc: Record<string, number>, e: any) => {
    acc[e.event_name] = (acc[e.event_name] || 0) + 1;
    return acc;
  }, {});
  return Object.values(nameCount).filter((count: number) => count > 1).length;
}

function getEventsOnSameDay(events: any[]): number {
  const dateCount: Record<string, number> = events.reduce((acc: Record<string, number>, e: any) => {
    const date = new Date(e.event_date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return Object.values(dateCount).filter((count: number) => count > 1).length;
}

export default async function AllTrophiesPage() {
  const supabase = await createClient();
  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div className="text-center py-20 text-xl text-white">Veuillez vous connecter.</div>;
  }

  // Récupérer les événements créés ou où l'utilisateur est invité
  const { data: ownedEvents } = await supabase
    .from('event')
    .select('*')
    .eq('owner_id', user.id);

  const { data: invitedEvents } = await supabase
    .from('invite')
    .select('event:event_id(*)')
    .eq('user_id', user.id);

  // Fusionner et dédupliquer les événements
  const invitedEventsList = (invitedEvents || []).map((i: any) => i.event).filter(Boolean);
  const allEvents = [...(ownedEvents || []), ...invitedEventsList];
  const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());

  // Séparer événements passés et à venir
  const now = new Date();
  const upcomingEvents = uniqueEvents.filter(e => new Date(e.event_date) >= now);
  const pastEvents = uniqueEvents.filter(e => new Date(e.event_date) < now);

  // Calculs spécifiques pour les trophées réalisables
  const uniqueCities = getUniqueCities(uniqueEvents);
  const sameNameCount = getSameNameEvents(uniqueEvents);
  const sameDayCount = getEventsOnSameDay(uniqueEvents);
  const hasPaidEvent = uniqueEvents.some(e => e.price && e.price > 0);
  const hasFreeEvent = uniqueEvents.some(e => !e.price || e.price === 0);
  const hasRecentEvent = uniqueEvents.some(e => {
    const created = new Date(e.created_at);
    return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000;
  });
  const firstEvent = uniqueEvents.length > 0;
  const userCity = uniqueEvents[0]?.city;
  const hasEventInUserCity = userCity && uniqueEvents.some(e => e.city === userCity);

  // Calculer la progression réelle
  const trophies = [
    {
      name: "Explorateur",
      icon: "🌍",
      progress: pastEvents.length,
      nextLevel: 5,
      description: "Participe à 5 événements pour débloquer ce trophée.",
    },
    {
      name: "Organisateur",
      icon: "🎯",
      progress: ownedEvents?.length || 0,
      nextLevel: 3,
      description: "Crée 3 événements pour débloquer ce trophée.",
    },
    {
      name: "Social",
      icon: "👥",
      progress: uniqueEvents.reduce((acc, event) => acc + (event.accepted_count || 0), 0),
      nextLevel: 10,
      description: "10 invités acceptés à tes événements.",
    },
    {
      name: "Globe-trotter",
      icon: "✈️",
      progress: uniqueCities.length,
      nextLevel: 3,
      description: "Participe à 3 événements dans des villes différentes.",
    },
    {
      name: "Fidèle",
      icon: "🔁",
      progress: sameNameCount,
      nextLevel: 2,
      description: "Participe à 2 éditions d'un même événement.",
    },
    {
      name: "VIP",
      icon: "💎",
      progress: hasPaidEvent ? 1 : 0,
      nextLevel: 1,
      description: "Participe à un événement payant.",
    },
    {
      name: "Gratuité",
      icon: "🆓",
      progress: hasFreeEvent ? 1 : 0,
      nextLevel: 1,
      description: "Participe à un événement gratuit.",
    },
    {
      name: "Marathonien",
      icon: "🏃‍♂️",
      progress: sameDayCount,
      nextLevel: 2,
      description: "Participe à 2 événements le même jour.",
    },
    {
      name: "Précoce",
      icon: "⏳",
      progress: hasRecentEvent ? 1 : 0,
      nextLevel: 1,
      description: "Participe à un événement créé il y a moins de 24h.",
    },
    {
      name: "À venir",
      icon: "📅",
      progress: upcomingEvents.length,
      nextLevel: 3,
      description: "Avoir 3 événements à venir.",
    },
    {
      name: "Créateur en série",
      icon: "📝",
      progress: ownedEvents?.length || 0,
      nextLevel: 5,
      description: "Crée 5 événements.",
    },
    {
      name: "Première fois",
      icon: "✨",
      progress: firstEvent ? 1 : 0,
      nextLevel: 1,
      description: "Participe à ton tout premier événement.",
    },
    {
      name: "Ville natale",
      icon: "🏠",
      progress: hasEventInUserCity ? 1 : 0,
      nextLevel: 1,
      description: "Participe à un événement dans ta ville.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Bouton retour */}
      <Link href="/dashboard" className="absolute top-6 left-6 bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all">
        ← Retour
      </Link>
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-violet-400 mb-8 text-center">Tous les Trophées</h1>
        <div className="space-y-6">
          {trophies.map((trophy, idx) => (
            <div key={idx} className="flex items-center gap-6 p-6 rounded-xl bg-neutral-900/80 shadow-lg border border-neutral-800">
              <div className="text-5xl">{trophy.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xl font-semibold text-white">{trophy.name}</div>
                  <div className="text-sm text-gray-400">{trophy.progress}/{trophy.nextLevel}</div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500" style={{ width: `${Math.min((trophy.progress / trophy.nextLevel) * 100, 100)}%` }}></div>
                </div>
                <div className="text-gray-300 text-sm italic">{trophy.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 