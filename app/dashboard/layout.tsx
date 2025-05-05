import { Card } from "@heroui/card";
import { NewLink as Link } from "@/components/ui/link";
import { Divider } from "@heroui/divider";
import React from "react";
import { MdOutlineDashboard, MdEvent, MdEventRepeat } from "react-icons/md";
import { FaRegCalendarPlus } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import AuthButton from "./auth-button";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Card className="sticky left-0 top-0 float-left w-64 min-h-screen p-4 flex flex-col justify-between">
        {/* Logo */}
        <div>
          <Link color="foreground" href="/" className="inline-block mb-8">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MEET</span>
              <span className="text-white">SYNC</span>
            </h1>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdOutlineDashboard className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Tableau de bord</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <FaRegCalendarPlus className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Créer un événement</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/my_event"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdEvent className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Mes événements</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/my_invit"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <SlEnvolopeLetter className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Mes invitations</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard/all_event"
              color="foreground"
              className="group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200"
            >
              <MdEventRepeat className="text-xl text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200">Tous les événements</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Profil & Déconnexion */}
        <div className="flex flex-col gap-2">
          <Divider />
          <AuthButton />
        </div>
      </Card>
      <main className="ml-72 p-6 flex-1">{children}</main>
    </div>
  );
}