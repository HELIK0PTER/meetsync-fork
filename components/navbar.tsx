"use client";

import React from "react";
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
import { Avatar } from "@heroui/avatar";
import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import { useUser } from "../lib/UserContext";
import type { User } from "@supabase/supabase-js";

type NavLinkColor = "secondary" | "foreground" | "primary" | "success" | "warning" | "danger" | undefined;

type MenuItem = {
  name: string;
  href: string;
  color: NavLinkColor;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const pathname = usePathname();
  const userContext = useUser();
  const { user, loading } = userContext || { user: null, loading: false };
  const isDashboard = pathname.startsWith("/dashboard");

  const menuItems: MenuItem[] = [
    { name: "Accueil", href: "/", color: pathname === "/" ? "secondary" : "foreground" },
    { name: "Produits", href: "/product", color: pathname === "/product" ? "secondary" : "foreground" },
    { name: "Plans", href: "/plans", color: pathname === "/plans" ? "secondary" : "foreground" },
    { name: "Avis", href: "/review", color: pathname === "/review" ? "secondary" : "foreground" },
  ];

  if (isDashboard) return null;

  return (
    <HeroUINavbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
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
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.href}>
            <Link color={item.color} href={item.href}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {user ? (
            <Dropdown>
              <DropdownTrigger>
                <Link>
                  <Avatar isBordered src={(user as any)?.user_metadata?.avatar_url || undefined} />
                </Link>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu with icons"
                variant="faded"
              >
                <DropdownItem
                  key="new"
                  href="/dashboard"
                  startContent={<MdOutlineDashboard className={iconClasses} />}
                >
                  Tableau de bord
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  href="/auth/logout"
                  startContent={
                    <FiLogOut className={cn(iconClasses, "text-danger")} />
                  }
                >
                  Déconnection
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={Link}
              color="secondary"
              href="/auth/login"
              variant="flat"
            >
              Commencer
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full"
              color={item.color}
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
