"use client";

import { Card } from "@heroui/react";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import InviteManager from "./InviteManager";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

type Event = {
  id: string;
  event_name: string;
  event_date: string;
  city: string;
  country: string;
  banner_url?: string;
  cp: string | null;
  created_at: string;
  has_reminder: boolean;
  is_public: boolean;
  num_rue: string | null;
  owner_id: string;
  paypal_email: string | null;
  rue: string;
  invite?: Array<any>;
  price: number | null;
  profiles: {
    email: string;
  };
};

export default function EventContent({ event }: { event: Event }) {
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(
    event.banner_url || null
  );

  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user || null);
    };
    fetchUser();
  }, [supabase]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setBannerUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `event-banners/${event.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("banners")
      .upload(filePath, file, { upsert: true });
    if (error) {
      setBannerUploading(false);
      alert("Erreur lors de l'upload de la bannière");
      return;
    }
    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("banners")
      .getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      setBannerUrl(publicUrlData.publicUrl);
      // Mettre à jour l'event
      await supabase
        .from("event")
        .update({ banner_url: publicUrlData.publicUrl })
        .eq("id", event.id);
    }
    setBannerUploading(false);
  };

  return (
    <div className="min-h-screen bg-black p-0 md:p-10 text-white">
      {/* Bannière avec upload */}
      <div
        className="w-full relative mb-8 shadow-lg"
        style={{ minHeight: 180 }}
      >
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt="Bannière"
            className="w-full h-48 object-cover rounded-b-xl"
            style={{ minHeight: 180, maxHeight: 220 }}
            width={1000}
            height={1000}
          />
        ) : (
          <div
            className="w-full h-48 bg-gradient-to-r from-violet-700 to-violet-500 rounded-b-xl"
            style={{ minHeight: 180, maxHeight: 220 }}
          ></div>
        )}
        {event.owner_id === user?.id && (
          <label
            className="absolute top-4 left-4 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-opacity-80 z-10 flex items-center justify-center"
            title="Changer la bannière"
          >
            <FaCamera className="text-white text-xl" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
              disabled={bannerUploading}
            />
          </label>
        )}
        {bannerUploading && (
          <div className="absolute top-4 left-16 text-white bg-black bg-opacity-60 px-3 py-1 rounded">
            Upload...
          </div>
        )}
        <div className="absolute bottom-6 left-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {event.event_name}
          </h1>
          <p className="text-lg mt-2 drop-shadow">
            Détails et gestion des invitations
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Card className="bg-neutral-900 p-6 rounded-lg w-full md:w-1/2 mb-6 md:mb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Informations de l'événement
            </h2>
          </div>
          <ul className="space-y-2">
            <li>
              <b>Nom :</b> {event.event_name}
            </li>
            <li>
              <b>Créateur :</b> {event.profiles.email}
            </li>
            <li>
              <b>Date :</b>{" "}
              {new Date(event.event_date).toLocaleDateString("fr-FR")}
            </li>
            <li>
              <b>Ville :</b> {event.city}
            </li>
            <li>
              <b>Pays :</b> {event.country}
            </li>
            <li>
              <b>Rue :</b> {event.rue}
            </li>
            <li>
              <b>Prix :</b> {event.price ? event.price + " €" : "Gratuit"}
            </li>
            <li>
              <b>Rappel automatique :</b> {event.has_reminder ? "Oui" : "Non"}
            </li>
            <li className="text-gray-400 text-xs mt-2">ID : {event.id}</li>
          </ul>
        </Card>
        <InviteManager user={user} event={event} />
      </div>
    </div>
  );
}
