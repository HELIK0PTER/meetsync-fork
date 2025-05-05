"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Listbox, ListboxItem, Avatar, Button } from "@heroui/react";
import { User } from "@supabase/supabase-js";

type Event = {
  id: string;
  owner_id: string;
  event_name: string;
  event_date: string;
  city: string;
  country: string;
};

type Invite = {
  id: string;
  email: string;
  profiles: {
    id: string;
    profile_picture: string;
    email: string;
  };
  must_pay: boolean;
  status: string;
  event_id: string;
  user_id: string;
  created_at: string;
};

export default function InviteManager({
  event,
  user,
}: {
  event: Event;
  user: User | null;
}) {
  const [invitations, setInvitations] = useState<Invite[]>([]);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [invitePay, setInvitePay] = useState(true);
  const [addingInvite, setAddingInvite] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchInvitations = async () => {
      // Récupération des invitations avec jointure automatique sur les profils
      const { data, error: inviteError } = await supabase
        .from("invite")
        .select(
          `
          id,
          email,
          must_pay,
          status,
          event_id,
          user_id,
          created_at,
          profiles!inner(id, profile_picture, email)
        `
        )
        .eq("event_id", event.id)
        .order("id", { ascending: true });

      const error = inviteError;
      if (!error && data) setInvitations(data as unknown as Invite[]);
      setInviteLoading(false);
    };
    fetchInvitations();
  }, [event.id, addingInvite, supabase]);

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingInvite(true);
    setError("");
    if (!inviteName.trim()) {
      setError("L'email de l'invité est requis.");
      setAddingInvite(false);
      return;
    }

    try {
      // Ajout de l'invitation dans la base de données
      const { data, error: supabaseError } = await supabase
        .from("invite")
        .insert([
          {
            event_id: event.id,
            email: inviteName.trim().toLowerCase(),
            must_pay: invitePay,
            status: "waiting",
          },
        ])
        .select();

      if (supabaseError) {
        setError(
          supabaseError.message || "Erreur lors de l'ajout de l'invitation."
        );
        setAddingInvite(false);
        return;
      }

      // Envoi de l'email d'invitation
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteName.trim().toLowerCase(),
          eventName: event.event_name,
          eventDate: event.event_date,
          eventLocation: `${event.city}, ${event.country}`
        }),
      });

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi de l\'email');
      }

      setInviteName("");
      setInvitePay(true);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError("Une erreur est survenue lors de l'ajout de l'invitation.");
    } finally {
      setAddingInvite(false);
    }
  };

  return (
    <Card className="bg-neutral-900 p-6 rounded-lg w-full md:w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Invitations</h2>
        {user?.id === event.owner_id && (
          <Button
            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 group"
            color="secondary"
            onClick={() => setShowModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter une invitation
          </Button>
        )}
      </div>
      {inviteLoading ? (
        <div className="text-gray-400">Chargement des invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="text-gray-400">
          Aucune invitation pour cet événement.
        </div>
      ) : (
        <Listbox aria-label="Invitations" className="bg-neutral-900 rounded-lg">
          {invitations.map((inv, index) => (
            <ListboxItem 
              key={index} 
              textValue={inv.email || "Inconnu"}
              className="p-4 hover:bg-neutral-800/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 w-full">
                <Avatar
                  name={inv.email || "Inconnu"}
                  size="lg"
                  src={inv.profiles?.profile_picture || undefined}
                  className="ring-2 ring-neutral-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base mb-1 whitespace-nowrap overflow-x-auto max-w-none">{inv.email || "Inconnu"}</div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inv.must_pay 
                        ? "bg-purple-500/20 text-purple-400" 
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {inv.must_pay ? "Payant" : "Gratuit"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inv.status === "waiting"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : inv.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : inv.status === "refused"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {inv.status === "waiting" ? "En attente" : 
                       inv.status === "accepted" ? "Accepté" : 
                       inv.status === "refused" ? "Refusé" : 
                       inv.status}
                    </span>
                  </div>
                </div>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Ajouter une invitation</h3>
            <form onSubmit={handleAddInvite} className="flex flex-col gap-4">
              <input
                type="text"
                className="bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none"
                placeholder="Email de l'invité"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={invitePay}
                  onChange={(e) => setInvitePay(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                L'utilisateur doit payer
              </label>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                className="text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                disabled={addingInvite}
                color="secondary"
              >
                {addingInvite ? "Ajout..." : "Ajouter"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
