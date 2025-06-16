"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@heroui/react";

export default function JoinOrLeaveButton({ eventId, ownerId }: { eventId: string, ownerId: string }) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || null);
        setDisplayName(
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Utilisateur"
        );
        setProfilePicture(user.user_metadata?.avatar_url || user.user_metadata?.profile_picture || null);
      }
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    const fetchInvite = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("invite")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .maybeSingle();
      setInvite(data);
      setLoading(false);
    };
    fetchInvite();
  }, [userId, eventId, supabase]);

  const handleJoin = async () => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from("invite")
      .insert({
        event_id: eventId,
        user_id: userId,
        status: "accepted",
        must_pay: false,
        email: userEmail,
        display_name: displayName,
        profile_picture: profilePicture,
      });
    if (!error) {
      setInvite({
        event_id: eventId,
        user_id: userId,
        status: "accepted",
        must_pay: false,
        email: userEmail,
        display_name: displayName,
        profile_picture: profilePicture,
      });
    }
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!userId || !userEmail) return;
    setLoading(true);
    
    const { error, data } = await supabase
      .from("invite")
      .delete()
      .eq("event_id", eventId)
      .or(`and(user_id.eq.${userId},event_id.eq.${eventId}),and(email.eq.${userEmail},event_id.eq.${eventId})`);
    
    if (!error) {
      setInvite(null);
    } else {
      alert("Erreur lors de la désinscription !");
    }
    setLoading(false);
  };

  if (userId && userId === ownerId) return null;
  if (loading) return <div className="text-gray-400 text-right">Chargement...</div>;

  return (
    <div className="flex justify-end mb-4">
      {!invite ? (
        <Button
          color="secondary"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          onClick={handleJoin}
        >
          Rejoindre
        </Button>
      ) : (
        <button
          className="text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/20 px-3 py-1 rounded-md transition-all duration-300"
          onClick={handleLeave}
        >
          Un imprévu ? Cliquez ici pour vous désinscrire
        </button>
      )}
    </div>
  );
} 