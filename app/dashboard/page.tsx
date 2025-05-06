import { createClient } from "@/utils/supabase/server";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { CiCirclePlus } from "react-icons/ci";
import { subtitle, title } from "@/components/primitives";
import DashboardClient from "@/components/dashboard/DashboardClient";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 dark:bg-black/30 rounded-xl shadow-md px-8 py-6 text-center min-w-[120px]">
      <div className="text-3xl font-bold text-violet-500">{value}</div>
      <div className="text-md mt-2 text-gray-700 dark:text-gray-300">{label}</div>
    </div>
  );
}

export default async function Dashboard() {
  const supabase = await createClient();
  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div className="text-center py-20 text-xl">Veuillez vous connecter.</div>;
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

  const hasEvents = uniqueEvents.length > 0;

  // Je prépare le passage des événements recommandés (4 aléatoires)
  const recommendedEvents = uniqueEvents
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        {!hasEvents ? (
          <div className="inline-block max-w-xl text-center justify-center">
            <span className={title()}>Bienvenue sur&nbsp;</span>
            <span className={title({ color: "violet" })}>MeetSync&nbsp;</span>
            <span className={title()}>!&nbsp;</span>
            <div className={subtitle({ class: "mt-4" })}>
              Vous venez d'arriver ? Commencez par crée un événements.
            </div>
            <div className="flex gap-3 mt-8 justify-center">
              <Link
                className={buttonStyles({
                  color: "secondary",
                  radius: "full",
                  variant: "shadow",
                })}
                href="/dashboard/create"
              >
                <CiCirclePlus className="text-3xl" /> Creer un événements
              </Link>
            </div>
          </div>
        ) : (
          <DashboardClient
            stats={{
              total: uniqueEvents.length,
              upcoming: upcomingEvents.length,
              past: pastEvents.length,
            }}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            recommendedEvents={recommendedEvents}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
