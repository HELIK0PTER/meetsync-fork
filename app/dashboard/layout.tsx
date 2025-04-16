
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
    <div className="layout">
      <Card className="sticky left-0 top-0 float-left w-64 min-h-screen p-4 flex flex-col justify-between">
        {/* Logo */}
        <div>
          <Link color="foreground" href="/" className="inline-block mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MeetSync</h1>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdOutlineDashboard className="text-xl" />
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <FaRegCalendarPlus className="text-xl" />
              Créer un événement
            </Link>
            <Link
              href="/dashboard/my_invit"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <SlEnvolopeLetter className="text-xl" />
              Mes invitations
            </Link>
            <Link
              href="/dashboard/my_event"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdEvent className="text-xl" />
              Mes événements
            </Link>
            <Link
              href="/dashboard/all_event"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdEventRepeat className="text-xl" />
              Tous les événements
            </Link>
          </nav>
        </div>

        {/* Profil & Déconnexion */}

        <div className="flex flex-col gap-2">
          <Divider />
          <AuthButton />
        </div>
      </Card>
      <main className="ml-72 p-6 w-full">{children}</main>
    </div>
  );
}