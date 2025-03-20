"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Card,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@heroui/react";
import { useUser } from "@/lib/UserContext";
import { Divider } from "@heroui/divider";
import React from "react";
import { MdEvent, MdOutlineDashboard, MdEventRepeat } from "react-icons/md";
import { FaRegCalendarPlus } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { FiLogOut } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function EventIcon(props: { className: string }) {
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <div className="layout">
      <Card className="left-0 top-0 float-left w-64 min-h-screen p-4 flex flex-col justify-between">
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
              isBlock
            >
              <MdOutlineDashboard className="text-lg" />
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
              isBlock
            >
              <FaRegCalendarPlus className="text-lg" />
              Créer un événement
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
              isBlock
            >
              <SlEnvolopeLetter className="text-lg" />
              Mes invitations
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
              isBlock
            >
              <MdEvent className="text-lg" />
              Mes événements
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className="flex items-center gap-2 p-2"
              isBlock
            >
              <MdEventRepeat className="text-lg" />
              Tous les événements
            </Link>
          </nav>
        </div>

        {/* Profil & Déconnexion */}

        <div className="flex flex-col gap-2">
          <Divider />
          <Dropdown>
            <DropdownTrigger>
              <Link color="foreground" className="flex items-center gap-2 p-2">
                <Avatar src={user.user_metadata?.avatar_url} isBordered />
                <span>{user.user_metadata?.full_name}</span>
              </Link>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
              <DropdownItem
                key="profil"
                href="/dashboard/profil"
                startContent={<CgProfile className={iconClasses} />}
              >
                Profil
              </DropdownItem>
              <DropdownItem
                key="settings"
                href="/dashboard/settings"
                startContent={<CiSettings className={iconClasses} />}
              >
                Paramètres
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={
                  <FiLogOut className={cn(iconClasses, "text-danger")} />
                }
                href="/auth/logout"
              >
                Déconnection
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Card>
      <main className="ml-64">{children}</main>
    </div>
  );
}
