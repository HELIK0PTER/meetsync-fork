"use client";
import EventList from "./EventList";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import EventCalendar from "./EventCalendar";

function countInvitations(events: any[]) {
  let total = 0, accepted = 0, refused = 0, waiting = 0;
  for (const e of events) {
    if (Array.isArray(e.invites)) {
      total += e.invites.length;
      accepted += e.invites.filter((i: any) => i.status === "accept").length;
      refused += e.invites.filter((i: any) => i.status === "refused").length;
      waiting += e.invites.filter((i: any) => i.status === "waiting").length;
    }
  }
  return { total, accepted, refused, waiting };
}

export default function DashboardClient({
  stats = { total: 0, upcoming: 0, past: 0 },
  upcomingEvents = [],
  pastEvents = [],
  recommendedEvents = [],
  user,
  trophies = [],
}: {
  stats?: { total: number, upcoming: number, past: number },
  upcomingEvents?: any[],
  pastEvents?: any[],
  recommendedEvents?: any[],
  user?: { email?: string; user_metadata?: { full_name?: string } },
  trophies?: { name: string; progress: number; nextLevel: number; icon: string }[],
}) {
  // Prénom ou fallback
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Utilisateur";
  // Filtre rapide sur les events à venir
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  let filteredUpcoming = upcomingEvents.filter(e => e.event_name.toLowerCase().includes(search.toLowerCase()));
  filteredUpcoming = filteredUpcoming.sort((a, b) => sortAsc ? new Date(a.event_date).getTime() - new Date(b.event_date).getTime() : new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  // Invitations
  const { total: totalInv, accepted: acceptedInv, refused: refusedInv, waiting: waitingInv } = countInvitations([...upcomingEvents, ...pastEvents]);
  // Badge 'Nouveau' (moins de 3 jours)
  const isNew = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
    return diff < 3;
  };
  // Trophées débloqués (progress >= nextLevel)
  const unlockedTrophies = trophies.filter(t => t.progress >= t.nextLevel);
  // Trophées non terminés, triés par progression décroissante
  const inProgressTrophies = trophies
    .filter(t => t.progress < t.nextLevel)
    .map(t => ({ ...t, percent: t.nextLevel === 0 ? 0 : t.progress / t.nextLevel }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full relative">
      {/* Header dynamique */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenue, {firstName} !</h1>
        <p className="text-gray-400 mb-4">Voici votre tableau de bord MeetSync</p>
        <div className="flex gap-8 mb-4">
          <div className="bg-white/10 dark:bg-black/30 rounded-xl shadow-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-3xl font-bold text-violet-500">{stats.total}</div>
            <div className="text-md mt-2 text-gray-700 dark:text-gray-300">Événements total</div>
          </div>
          <div className="bg-white/10 dark:bg-black/30 rounded-xl shadow-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-3xl font-bold text-violet-500">{stats.upcoming}</div>
            <div className="text-md mt-2 text-gray-700 dark:text-gray-300">À venir</div>
          </div>
          <div className="bg-white/10 dark:bg-black/30 rounded-xl shadow-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-3xl font-bold text-violet-500">{stats.past}</div>
            <div className="text-md mt-2 text-gray-700 dark:text-gray-300">Passés</div>
          </div>
          <div className="bg-white/10 dark:bg-black/30 rounded-xl shadow-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-3xl font-bold text-violet-500">{waitingInv}</div>
            <div className="text-md mt-2 text-gray-700 dark:text-gray-300">Invitations en attente</div>
            <div className="text-sm text-green-400">{acceptedInv} acceptées</div>
            <div className="text-sm text-red-400">{refusedInv} refusées</div>
          </div>
        </div>
        <div className="flex gap-4 mb-2">
          <Link href="/dashboard/my_event" className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 text-sm font-semibold transition-all">Voir tous mes événements</Link>
        </div>
        {/* Section Mes trophées débloqués */}
        {unlockedTrophies.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-white/80 mr-2">Mes trophées débloqués :</span>
            {unlockedTrophies.map((t, i) => (
              <span key={i} title={t.name} className="text-2xl">{t.icon}</span>
            ))}
            <Link href="/dashboard/trophee" className="ml-2 text-xs text-violet-400 underline hover:text-violet-300">Voir tous</Link>
          </div>
        )}
        {/* Barre de séparation */}
        <hr className="w-full max-w-2xl border-violet-500/40 my-6 mx-auto" />
        {/* Trophées juste après le bouton */}
        {trophies.length > 0 && (
          <div className="max-w-2xl mx-auto mt-0">
            <h2 className="text-xl font-semibold text-white mb-4">Vos Trophées</h2>
            <div className="space-y-2">
              {inProgressTrophies.map((trophy, index) => (
                <Link
                  key={index}
                  href="/dashboard/trophee"
                  className="flex items-center gap-4 p-4 border-b border-neutral-800 rounded-lg transition-all duration-200 hover:bg-violet-700/20 cursor-pointer group"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">{trophy.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white font-medium">{trophy.name}</div>
                      <div className="text-sm text-gray-400">
                        {trophy.progress}/{trophy.nextLevel}
                      </div>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trophy.progress / trophy.nextLevel) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Séparateur */}
      <hr className="w-full max-w-4xl border-violet-300/20 my-6" />
      {/* Section événements à venir avec filtre et tri */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-violet-400">Prochains événements</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-white/10 border border-violet-300/20 rounded px-3 py-1 text-sm text-gray-200 focus:outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 180 }}
            />
            <button
              className="ml-2 px-3 py-1 rounded bg-violet-500 text-white text-xs hover:bg-violet-600 transition-all"
              onClick={() => setSortAsc(v => !v)}
              title="Trier par date"
            >
              {sortAsc ? "Date croissante" : "Date décroissante"}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {filteredUpcoming.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <EventList
                events={filteredUpcoming.map(e => ({ ...e, isNew: isNew(e.created_at) }))}
                title=""
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center py-8"
            >Aucun événement à venir</motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Séparateur */}
      <hr className="w-full max-w-4xl border-violet-300/20 my-6" />
      {/* Section événements passés */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold text-violet-400 mb-2">Événements passés</h2>
        <AnimatePresence>
          {pastEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <EventList events={pastEvents} title="" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center py-8"
            >Aucun événement passé</motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Séparateur */}
      <hr className="w-full max-w-4xl border-violet-300/20 my-6" />
      {/* Section recommandé */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold text-violet-400 mb-2">Recommandé pour vous</h2>
        <AnimatePresence>
          {recommendedEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <EventList events={recommendedEvents} title="" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center py-8"
            >Aucune recommandation pour l'instant</motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 