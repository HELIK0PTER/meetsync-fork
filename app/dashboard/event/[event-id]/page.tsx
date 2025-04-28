'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function EventDetailPage({ params }: { params: { 'event-id': string } }) {
  const eventId = params['event-id'];
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventId)
        .single();
      if (!error) setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [eventId, supabase]);

  if (loading) {
    return <div className="text-white p-10">Chargement...</div>;
  }
  if (!event) {
    return <div className="text-white p-10">Aucun événement trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-4">{event.event_name}</h1>
      <p>Date : {new Date(event.event_date).toLocaleDateString('fr-FR')}</p>
      <p>Ville : {event.city}</p>
      <p>Pays : {event.country}</p>
      <p>Rue : {event.rue}</p>
      <p>Prix : {event.price ? event.price + ' €' : 'Gratuit'}</p>
      <p>Rappel automatique : {event.has_reminder ? 'Oui' : 'Non'}</p>
      <p className="mt-6 text-gray-400">ID de l'événement : {event.id}</p>
    </div>
  );
} 