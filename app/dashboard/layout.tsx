import { Card } from "@heroui/card";
import { NewLink as Link } from "@/components/ui/link";
import { Divider } from "@heroui/divider";
import React from "react";
import { MdOutlineDashboard, MdEvent, MdEventRepeat } from "react-icons/md";
import { FaRegCalendarPlus, FaTrophy } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import AuthButton from "./auth-button";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
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
  const invitedEventsList = (invitedEvents || []).map((i: any) => i.event).filter(Boolean);
  const allEvents = [...(ownedEvents || []), ...invitedEventsList];
  const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());
  const now = new Date();
  const pastEvents = uniqueEvents.filter(e => new Date(e.event_date) < now);
  const uniqueCities = Array.from(new Set(uniqueEvents.map((e: any) => e.city).filter(Boolean)));
  const sameNameCount = (() => {
    const nameCount: Record<string, number> = uniqueEvents.reduce((acc: Record<string, number>, e: any) => {
      acc[e.event_name] = (acc[e.event_name] || 0) + 1;
      return acc;
    }, {});
    return Object.values(nameCount).filter((count: number) => count > 1).length;
  })();
  const hasPaidEvent = uniqueEvents.some((e: any) => e.price && e.price > 0);
  const hasFreeEvent = uniqueEvents.some((e: any) => !e.price || e.price === 0);
  const sameDayCount = (() => {
    const dateCount: Record<string, number> = uniqueEvents.reduce((acc: Record<string, number>, e: any) => {
      const date = new Date(e.event_date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.values(dateCount).filter((count: number) => count > 1).length;
  })();
  const hasRecentEvent = uniqueEvents.some((e: any) => {
    const created = new Date(e.created_at);
    return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000;
  });
  const upcomingEvents = uniqueEvents.filter(e => new Date(e.event_date) >= now);
  const firstEvent = uniqueEvents.length > 0;
  const userCity = uniqueEvents[0]?.city;
  const hasEventInUserCity = userCity && uniqueEvents.some((e: any) => e.city === userCity);
  const unlockedTrophies = [
    { name: "Explorateur", icon: "🌍", unlocked: pastEvents.length >= 5 },
    { name: "Organisateur", icon: "🎯", unlocked: (ownedEvents?.length || 0) >= 3 },
    { name: "Social", icon: "👥", unlocked: uniqueEvents.reduce((acc: number, event: any) => acc + (event.accepted_count || 0), 0) >= 10 },
    { name: "Globe-trotter", icon: "✈️", unlocked: uniqueCities.length >= 3 },
    { name: "Fidèle", icon: "🔁", unlocked: sameNameCount >= 2 },
    { name: "VIP", icon: "💎", unlocked: hasPaidEvent },
    { name: "Gratuité", icon: "🆓", unlocked: hasFreeEvent },
    { name: "Marathonien", icon: "🏃‍♂️", unlocked: sameDayCount >= 2 },
    { name: "Précoce", icon: "⏳", unlocked: hasRecentEvent },
    { name: "À venir", icon: "📅", unlocked: upcomingEvents.length >= 3 },
    { name: "Créateur en série", icon: "📝", unlocked: (ownedEvents?.length || 0) >= 5 },
    { name: "Première fois", icon: "✨", unlocked: firstEvent },
    { name: "Ville natale", icon: "🏠", unlocked: hasEventInUserCity },
  ].filter(t => t.unlocked);

  return (
    <div>
      <Card className="sticky left-0 top-0 float-left w-64 min-h-screen p-4 flex flex-col justify-between">
        {/* Logo */}
        <div>
          <Link color="foreground" href="/" className="inline-block mb-8">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MEET</span>
              <span className="text-white">SYNC</span>
            </h1>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdOutlineDashboard className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Tableau de bord</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <FaRegCalendarPlus className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Créer un événement</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/my_event"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdEvent className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Mes événements</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/my_invit"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <SlEnvolopeLetter className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Mes invitations</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/all_event"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdEventRepeat className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Tous les événements</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Trophées débloqués en bas */}
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/trophee" className="group mb-2 flex flex-col items-center w-full no-underline">
            <div className="w-full flex flex-col items-center relative overflow-hidden p-2 bg-black/10 rounded-lg border border-violet-400/70 cursor-pointer transition-shadow duration-300 group-hover:shadow-[0_0_16px_4px_rgba(139,92,246,0.3)]">
              {/* Effet de brillance animée */}
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <span className="block w-full h-full shimmer-diagonal"></span>
              </span>
              <span className="relative z-10 text-xl font-extrabold text-violet-400 tracking-wide mb-2 select-none">Trophées</span>
              <div className="flex flex-wrap justify-center gap-2 min-h-[48px] max-h-[96px] overflow-y-auto w-full">
                {unlockedTrophies.length === 0 ? (
                  <span className="text-xs text-gray-400">Aucun trophée débloqué</span>
                ) : (
                  unlockedTrophies.map((t, i) => (
                    <span key={i} title={t.name} className="text-2xl cursor-pointer select-none">{t.icon}</span>
                  ))
                )}
              </div>
            </div>
          </Link>
          <Divider />
          <AuthButton />
        </div>
      </Card>
      <main className="ml-72 p-6 flex-1">{children}</main>
    </div>
  );
}