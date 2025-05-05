"use client";
import React from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { NewLink } from "@/components/ui/link";
import { usePathname } from "next/navigation";

import AuthButton from "@/components/auth-button";

type MenuItem = {
  name: string;
  href: string;
};

export const Navbar = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: "Accueil",
      href: "/#top",
    },
    {
      name: "Fonctionnalités",
      href: "/#product",
    },
    {
      name: "Avis",
      href: "/#review",
    },
    {
      name: "Plans",
      href: "/#plans",
    },
  ];

  return (
    <HeroUINavbar
      isBordered
      className="w-full animate-fade-in"
    >
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <span className="font-bold text-3xl">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MEET</span>
            <span className="text-white">SYNC</span>
          </span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <span className="font-bold text-3xl">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MEET</span>
            <span className="text-white">SYNC</span>
          </span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} className="group relative">
            <NewLink
              href={item.href}
              className={`
                text-lg font-medium transition-all duration-200
                group-hover:text-purple-600
                ${pathname === item.href.replace('/#', '/') ? 'text-purple-600' : 'text-white'}
              `}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </NewLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
