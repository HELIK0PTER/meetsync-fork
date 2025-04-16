import React from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { NewLink } from "@/components/ui/link";

import AuthButton from "@/components/auth-button";

type MenuItem = {
  name: string;
  href: string;
};

export const Navbar = () => {

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
    >
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">MEETSYNC</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <NewLink href="/#" className="font-bold text-2xl text-inherit">MEETSYNC</NewLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <NewLink color={"foreground"} href={item.href}>
              {item.name}
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
