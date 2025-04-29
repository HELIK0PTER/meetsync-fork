'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, Listbox, ListboxItem, Avatar, Button } from "@heroui/react";

export default function InviteManager({ eventId }: { eventId: string }) {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [invitePay, setInvitePay] = useState(true);
  const [addingInvite, setAddingInvite] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchInvitations = async () => {
      const { data, error } = await supabase
        .from('invite')
        .select(`
          *,
          user:user_public_profile (
            id,
            email,
            picture
          )
        `)
        .eq('event_id', eventId)
        .order('id', { ascending: true });
      if (!error && data) setInvitations(data);
      setInviteLoading(false);
    };
    fetchInvitations();
  }, [eventId, addingInvite, supabase]);

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingInvite(true);
    setError("");
    if (!inviteName.trim()) {
      setError("L'email de l'invité est requis.");
      setAddingInvite(false);
      return;
    }

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        email: inviteName.trim().toLowerCase(),
        mustPay: invitePay
      })
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || "Erreur lors de l'ajout de l'invitation.");
      setAddingInvite(false);
      return;
    }

    setInviteName("");
    setInvitePay(true);
    setShowModal(false);
    setAddingInvite(false);
  };

  return (
    <Card className="bg-neutral-900 p-6 rounded-lg w-full md:w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Invitations</h2>
        <Button
          className="text-white px-4 py-2 rounded-lg transition-all"
          color='secondary'
          onClick={() => setShowModal(true)}
        >
          + Ajouter une invitation
        </Button>
      </div>
      {inviteLoading ? (
        <div className="text-gray-400">Chargement des invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="text-gray-400">Aucune invitation pour cet événement.</div>
      ) : (
        <Listbox aria-label="Invitations" className="bg-neutral-900 rounded-lg">
          {invitations.map((inv) => (
            <ListboxItem key={inv.id} textValue={inv.user?.email || 'Inconnu'}>
              <div className="flex items-center gap-3">
                <Avatar 
                  name={inv.user?.email || 'Inconnu'} 
                  size="sm" 
                  src={inv.user?.picture || undefined}
                />
                <div>
                  <div className="font-medium">{inv.user?.email || 'Inconnu'}</div>
                  <div className="text-xs text-gray-400 flex gap-2 items-center">
                    <span>{inv.must_pay ? "Payant" : "Gratuit"}</span>
                    <span className={
                      inv.status === "pending" ? "text-yellow-400" :
                      inv.status === "accepted" ? "text-green-400" :
                      inv.status === "refused" ? "text-red-400" : "text-gray-400"
                    }>
                      {inv.status}
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
                onChange={e => setInviteName(e.target.value)}
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={invitePay}
                  onChange={e => setInvitePay(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                L'utilisateur doit payer
              </label>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                className="text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                disabled={addingInvite}
                color='secondary'
              >
                {addingInvite ? 'Ajout...' : 'Ajouter'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
} 