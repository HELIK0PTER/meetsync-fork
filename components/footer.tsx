"use client";

import { Divider } from "@heroui/divider";
import { Spacer } from "@heroui/react";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";

import { ThemeSwitch } from "@/components/theme-switch";

export const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <>
      <Divider />
      <footer className="flex flex-col items-center justify-center py-10">
        <p className="text-2xl">MEETSYNC</p>
        <Spacer y={5} />
        <div className="flex flex-row gap-5">
          <Link isBlock color="secondary" size="lg">
            Accueil
          </Link>
          <Link isBlock color="secondary" size="lg">
            Produits
          </Link>
          <Link isBlock color="secondary" size="lg">
            Plans
          </Link>
          <Link isBlock color="secondary" size="lg">
            Avis
          </Link>
          <ThemeSwitch />
        </div>
        <Spacer y={5} />
        <span className="text-gray-700">
          &copy; Tout droits réservé, MeetSync, 2025
        </span>
      </footer>
    </>
  );
};
