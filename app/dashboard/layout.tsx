
import { Card } from "@heroui/card";
import { NewLink as Link } from "@/components/ui/link";
import { Divider } from "@heroui/divider";
import React from "react";
import { MdEvent, MdOutlineDashboard, MdEventRepeat } from "react-icons/md";
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
          <Link color="foreground" href="/">
            <h1 className="text-xl font-bold mb-6">MeetSync</h1>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdOutlineDashboard className="text-lg" />
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <FaRegCalendarPlus className="text-lg" />
              Créer un événement
            </Link>
            <Link
              href="/dashboard/my_invit"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <SlEnvolopeLetter className="text-lg" />
              Mes invitations
            </Link>
            <Link
              href="/dashboard/my_event"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdEvent className="text-lg" />
              Mes événements
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
            >
              <MdEventRepeat className="text-lg" />
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
      <main className="ml-64">{children}</main>
    </div>
  );
}
