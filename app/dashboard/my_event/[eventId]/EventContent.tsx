"use client";

import { Card } from "@heroui/react";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import InviteManager from "./InviteManager";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import JoinOrLeaveButton from "@/components/dashboard/JoinOrLeaveButton";

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
    <div className="bg-black p-0 md:p-10 text-white">
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
              className="w-full h-48 bg-gradient-to-r from-violet-700 to-violet-500 rounded-xl"
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

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="bg-neutral-900 p-6 rounded-lg w-full lg:w-1/2 mb-6 md:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Informations de l'événement
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">🎉</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Nom</div>
                  <div className="text-lg text-white font-medium">{event.event_name}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">👤</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Créateur</div>
                  <div className="text-lg text-white font-medium break-all">{event.profiles.email}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">📅</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Date</div>
                  <div className="text-lg text-white font-medium">{new Date(event.event_date).toLocaleDateString("fr-FR")}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">📍</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Ville</div>
                  <div className="text-lg text-white font-medium">{event.city}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">🌍</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Pays</div>
                  <div className="text-lg text-white font-medium">{event.country}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">🏠</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Rue</div>
                  <div className="text-lg text-white font-medium">{event.rue}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">💸</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Prix</div>
                  <div className={`text-lg font-medium ${event.price ? "text-purple-400" : "text-green-400"}`}>{event.price ? event.price + " €" : "Gratuit"}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">⏰</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">Rappel automatique</div>
                  <div className={`text-lg font-medium ${event.has_reminder ? "text-green-400" : "text-gray-400"}`}>{event.has_reminder ? "Activé" : "Désactivé"}</div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-800/80 hover:bg-violet-900/60 shadow transition-all duration-200 cursor-pointer">
                <span className="text-purple-400 text-xl font-bold">🆔</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-xs font-semibold uppercase">ID</div>
                  <div className="text-lg text-white font-medium">{event.id}</div>
                </div>
              </div>
            </div>
          </Card>
          <div className="w-full lg:w-1/2">
            <JoinOrLeaveButton eventId={event.id} ownerId={event.owner_id} />
            <InviteManager user={user} event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
