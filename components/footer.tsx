"use client"

import {Divider} from "@heroui/divider";
import {Spacer} from "@heroui/react";
import {Link} from "@heroui/link";
import {ThemeSwitch} from "@/components/theme-switch";
import {usePathname} from "next/navigation";

export const Footer = () => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    if (isDashboard) return null;
    return (
        <div>
            <Divider />
            <footer className="w-full flex flex-col items-center justify-center py-10">
                <p className="text-2xl">MEETSYNC</p>
                <Spacer y={5} />
                <div className="flex flex-row gap-5">
                    <Link color="secondary" size="lg" isBlock>Accueil</Link>
                    <Link color="secondary" size="lg" isBlock>Produits</Link>
                    <Link color="secondary" size="lg" isBlock>Plans</Link>
                    <Link color="secondary" size="lg" isBlock>Avis</Link>
                    <ThemeSwitch />
                </div>
                <Spacer y={5} />
                <span className="text-gray-700">&copy; Tout droits réservé, MeetSync, 2025</span>
            </footer>
        </div>

    );
};