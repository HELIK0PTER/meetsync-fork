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
      {/* Contenu principal */}
      <div>
        {/* Bannière avec upload */}
        <div
          className="w-full relative mb-8 shadow-lg overflow-hidden"
          style={{ minHeight: 180 }}
        >
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt="Bannière"
              className="w-full h-48 object-cover rounded-b-xl transform hover:scale-105 transition-transform duration-500"
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
              className="absolute top-4 left-4 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-opacity-80 z-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
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
            <div className="absolute top-4 left-16 text-white bg-black bg-opacity-60 px-3 py-1 rounded animate-pulse">
              Upload...
            </div>
          )}
          <div className="absolute bottom-6 left-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {event.event_name}
            </h1>
            <p className="text-lg mt-2 drop-shadow text-gray-200">
              Détails et gestion des invitations
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="bg-neutral-900 p-6 rounded-lg w-full md:w-1/2 mb-6 md:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Informations de l'événement
              </h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Nom :</span>
                <span className="text-gray-200">{event.event_name}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Créateur :</span>
                <span className="text-gray-200 break-all">{event.profiles.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Date :</span>
                <span className="text-gray-200">
                  {new Date(event.event_date).toLocaleDateString("fr-FR")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Ville :</span>
                <span className="text-gray-200">{event.city}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Pays :</span>
                <span className="text-gray-200">{event.country}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Rue :</span>
                <span className="text-gray-200">{event.rue}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Prix :</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  event.price 
                    ? "bg-purple-500/20 text-purple-400" 
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {event.price ? event.price + " €" : "Gratuit"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 font-medium">Rappel automatique :</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  event.has_reminder 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-gray-500/20 text-gray-400"
                }`}>
                  {event.has_reminder ? "Activé" : "Désactivé"}
                </span>
              </li>
              <li className="text-gray-400 text-xs mt-4">ID : {event.id}</li>
            </ul>
          </Card>
          <div className="w-full md:w-1/2">
            <InviteManager user={user} event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
