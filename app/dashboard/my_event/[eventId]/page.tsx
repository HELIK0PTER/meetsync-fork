import { createClient } from "@/utils/supabase/server";
import React from "react";
import EventContent from "./EventContent";

type Props = {
  params: Promise<{ eventId: string }	>;
};

export default async function EventDetailPage({
  params,
}: Props) {
  const { eventId } = await params;
  const supabase = await createClient();

  // Charger l'événement côté serveur avec les invitations
  const { data: event, error } = await supabase
    .from("event")
    .select(
      `
      *,
      invite(*),
      profiles!owner_id(
        email
      )
    `
    )
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return <div className="text-white p-10">Aucun événement trouvé.</div>;
  }

  return <EventContent event={event} />;
}
