"use client";

import { Avatar } from "@heroui/avatar";
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
import { MdOutlineDashboard, MdEvent, MdEventRepeat } from "react-icons/md";
import { FaRegCalendarPlus } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const navLinkClasses = "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-900 hover:text-pink-400";
  const activeClasses = "bg-gray-900 text-pink-400 font-medium";

  return (
    <div className="layout flex">
      <Card className="fixed left-0 top-0 w-72 h-screen p-6 flex flex-col justify-between shadow-md border-r border-gray-100">
        {/* Logo */}
        <div>
          <Link color="foreground" href="/" className="inline-block mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MeetSync</h1>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              color="foreground"
              className={navLinkClasses}
              isBlock
            >
              <MdOutlineDashboard className="text-xl" />
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/create"
              color="foreground"
              className={navLinkClasses}
              isBlock
            >
              <FaRegCalendarPlus className="text-xl" />
              Créer un événement
            </Link>
            <Link
              href="/dashboard/my_invit"
              color="foreground"
              className={navLinkClasses}
              isBlock
            >
              <SlEnvolopeLetter className="text-xl" />
              Mes invitations
            </Link>
            <Link
              href="/dashboard/my_event"
              color="foreground"
              className={navLinkClasses}
              isBlock
            >
              <MdEvent className="text-xl" />
              Mes événements
            </Link>
            <Link
              href="/dashboard/all_event"
              color="foreground"
              className={navLinkClasses}
              isBlock
            >
              <MdEventRepeat className="text-xl" />
              Tous les événements
            </Link>
          </nav>
        </div>

        {/* Profil & Déconnexion */}
        <div className="mt-auto">
          <Divider className="my-4" />
          <Dropdown placement="top-start">
            <DropdownTrigger>
              <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-900 hover:text-pink-400 transition-all">
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  isBordered
                  className="border-pink-400"
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.user_metadata?.username || user.user_metadata?.full_name}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-pink-300">Voir le profil</span>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions utilisateur" variant="flat" className="p-1">
              <DropdownItem
                key="profil"
                href="/dashboard/profil"
                startContent={<CgProfile className={cn(iconClasses, "text-pink-500")} />}
                className="py-2 hover:bg-gray-900 hover:text-pink-400"
              >
                Profil
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="py-2 hover:bg-gray-900 hover:text-pink-400"
                startContent={<FiLogOut className={iconClasses} />}
                href="/auth/logout"
              >
                Déconnexion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Card>
      <main className="ml-72 p-6 w-full">{children}</main>
    </div>
  );
}