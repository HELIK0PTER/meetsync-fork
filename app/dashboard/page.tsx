import { createClient } from "@/utils/supabase/server";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { CiCirclePlus } from "react-icons/ci";
import { subtitle, title } from "@/components/primitives";
import DashboardClient from "@/components/dashboard/DashboardClient";
import "./dashboard.css";

type Trophy = {
  name: string;
  progress: number;
  nextLevel: number;
  icon: string;
};

function TrophyCard({ trophy }: { trophy: Trophy }) {
  const progress = Math.min((trophy.progress / trophy.nextLevel) * 100, 100);
  
  return (
    <div className="flex items-center gap-4 p-4 border-b border-neutral-800">
      <div className="text-4xl">{trophy.icon}</div>
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
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
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

  // Calculer les trophées
  const trophies: Trophy[] = [
    {
      name: "Explorateur",
      progress: pastEvents.length,
      nextLevel: 5,
      icon: "🌍"
    },
    {
      name: "Organisateur",
      progress: ownedEvents?.length || 0,
      nextLevel: 3,
      icon: "🎯"
    },
    {
      name: "Social",
      progress: uniqueEvents.reduce((acc, event) => acc + (event.accepted_count || 0), 0),
      nextLevel: 10,
      icon: "👥"
    }
  ];

  // Je prépare le passage des événements recommandés (4 aléatoires)
  const recommendedEvents = uniqueEvents
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="opacity-0 animate-fadeIn" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
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
          <>
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
              trophies={trophies}
            />
          </>
        )}
      </div>
    </div>
  );
}
