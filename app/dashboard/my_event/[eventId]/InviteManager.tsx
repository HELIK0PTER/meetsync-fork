"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Listbox, ListboxItem, Avatar, Button } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { FaTrash } from "react-icons/fa";
import { RealtimeChannel } from "@supabase/supabase-js";

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
  must_pay: boolean;
  status: string;
  event_id: string;
  user_id: string;
  display_name: string;
  profile_picture: string;
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
  const [showAll, setShowAll] = useState(false);
  const invitesToShow = showAll ? invitations : invitations.slice(0, 5);
  const [confirmDelete, setConfirmDelete] = useState<{id: string, email: string} | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const fetchInvitations = async () => {
      // Récupération des invitations depuis la table 'invite'
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
          display_name,
          profile_picture
        `
        )
        .eq("event_id", event.id)
        .order("id", { ascending: true });

      const error = inviteError;
      if (!error && data) setInvitations(data as unknown as Invite[]);
      setInviteLoading(false);
    };

    fetchInvitations();

    // Abonnement aux changements en temps réel sur la table 'invite' pour cet événement
    channel = supabase
      .channel(`event_invites_${event.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invite",
          filter: `event_id=eq.${event.id}`,
        },
        () => {
          // Quand un changement se produit, refetch la liste complète
          // Une approche plus optimiste serait de manipuler l'état local,
          // mais un refetch est plus simple et garantit la cohérence avec la DB
          fetchInvitations();
        }
      )
      .subscribe();

    // Nettoyage de l'abonnement lorsque le composant est démonté ou que les dépendances changent
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
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
      const { error: supabaseError } = await supabase
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
      const response = await fetch("/api/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteName.trim().toLowerCase(),
          eventName: event.event_name,
          eventDate: event.event_date,
          eventLocation: `${event.city}, ${event.country}`,
          eventId: event.id,
        }),
      });

      if (!response.ok) {
        setError("Une erreur est survenue lors de l'envoi de l'email.");
      }

      setInviteName("");
      setInvitePay(true);
      setShowModal(false);
    } catch {
      setError("Une erreur est survenue lors de l'ajout de l'invitation.");
    } finally {
      setAddingInvite(false);
    }
  };

  const handleDeleteInvite = async (inviteId: string, email: string) => {
    setConfirmDelete({ id: inviteId, email });
  };

  const confirmDeleteInvite = async () => {
    if (!confirmDelete) return;
    // Optimistic update
    setInvitations(prev => prev.filter(inv => inv.id !== confirmDelete.id));
    await supabase.from('invite').delete().eq('id', confirmDelete.id);
    // Appel API pour envoyer le mail
    await fetch('/api/send-invite-removed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: confirmDelete.email, eventName: event.event_name }),
    });
    setConfirmDelete(null);
  };

  return (
    <Card className="bg-neutral-900 p-6 rounded-lg w-full">
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
          {invitesToShow.map((inv) => (
            <ListboxItem
              key={inv.id}
              textValue={inv.email || "Inconnu"}
              className="p-4 hover:bg-neutral-800/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 w-full">
                <Avatar
                  name={inv.display_name || "Inconnu"}
                  size="lg"
                  src={inv.profile_picture || undefined}
                  className="ring-2 ring-neutral-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base mb-1 whitespace-nowrap overflow-x-auto max-w-none">
                    {inv.email || "Inconnu"}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inv.must_pay
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {inv.must_pay ? "Payant" : "Gratuit"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inv.status === "waiting"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : inv.status === "accepted"
                            ? "bg-green-500/20 text-green-400"
                            : inv.status === "refused"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {inv.status === "waiting"
                        ? "En attente"
                        : inv.status === "accepted"
                          ? "Accepté"
                          : inv.status === "refused"
                            ? "Refusé"
                            : inv.status}
                    </span>
                  </div>
                </div>
                {user?.id === event.owner_id && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                    title="Annuler l'invitation"
                    onClick={() => handleDeleteInvite(inv.id, inv.email)}
                  >
                    <FaTrash style={{ fontSize: '1.4rem' }} />
                  </button>
                )}
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}
      {invitations.length > 5 && !showAll && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all"
            onClick={() => setShowAll(true)}
          >
            Voir plus
          </button>
        </div>
      )}
      {showAll && invitations.length > 5 && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all"
            onClick={() => setShowAll(false)}
          >
            Voir moins
          </button>
        </div>
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
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-white">Êtes-vous sûr de vouloir supprimer cette invitation ?</h3>
            <p className="mb-6 text-gray-300">L'utilisateur <span className="font-semibold text-violet-400">{confirmDelete.email}</span> sera notifié par email.</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold"
                onClick={() => setConfirmDelete(null)}
              >Annuler</button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                onClick={confirmDeleteInvite}
              >Confirmer la suppression</button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
