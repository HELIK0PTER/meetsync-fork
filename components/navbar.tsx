"use client";

import React from 'react';
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useUser } from "../lib/UserContext";
import {Avatar} from "@heroui/avatar";
import {cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import {usePathname} from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";


  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];
  const { user, loading } = useUser();

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;
  return (
      <HeroUINavbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>

            <p className="font-bold text-inherit">MEETSYNC</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="start">
          <NavbarBrand>
            <p className="font-bold text-2xl text-inherit">MEETSYNC</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link aria-current="page" color="secondary" href="/">
              Accueil
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/product">
              Produits
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/plans">
              Plans
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/review">
              Avis
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>

            {user ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Link><Avatar src={user.user_metadata?.avatar_url} isBordered>
                    </Avatar></Link>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                    <DropdownItem
                        key="new"
                        startContent={<MdOutlineDashboard className={iconClasses} />}
                        href="/dashboard"
                    >
                      Tableau de bord
                    </DropdownItem>
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<FiLogOut className={cn(iconClasses, "text-danger")} />}
                        href="/auth/logout"
                    >
                      Déconnection
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
            ) : (
                <Button as={Link} color="secondary" href="/auth/login" variant="flat">
                  Commencer
                </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                    className="w-full"
                    color={
                      index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                    }
                    href="#"
                    size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </HeroUINavbar>
  );
};
