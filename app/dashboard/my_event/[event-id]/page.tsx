import { createClient } from "@/utils/supabase/server";
import React from "react";
import EventContent from "./EventContent";

type Props = {
  searchParams: Promise<any>;
};

export default async function EventDetailPage({
  searchParams,
}: Props) {
  const { "event-id": eventId } = await searchParams;
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

  console.log(error);

  if (error || !event) {
    return <div className="text-white p-10">Aucun événement trouvé.</div>;
  }

  return <EventContent event={event} />;
}
