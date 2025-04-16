"use client";

import { MdOutlineDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { cn } from "@/utils/utils";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";

import { usePathname } from "next/navigation";

import { Suspense, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@heroui/button";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const AuthButton = () => {
  const supabase = createClient();
  const pathname = usePathname();

  const disabled = pathname.startsWith("/dashboard");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  return (
    <Suspense fallback={<Button color="secondary" isLoading />}>
      {user ? (
        <Dropdown isDisabled={disabled} shouldBlockScroll={false}>
          <DropdownTrigger>
            <Avatar
              isBordered
              src={(user as any)?.user_metadata?.avatar_url || undefined}
              className="hover:scale-[1.05] transition-all duration-300 hover:cursor-pointer"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
            <DropdownItem
              key="new"
              startContent={<MdOutlineDashboard className={iconClasses} />}
            >
              <Link href="/dashboard" className="text-white">
                <div className="w-40">Tableau de bord</div>
              </Link>
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={
                <FiLogOut className={cn(iconClasses, "text-danger")} />
              }
            >
              <Link href="/auth/logout" className="text-white w-full">
                <div className="w-40">Déconnection</div>
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Link href="/auth/login">
          <Button color="secondary">Commencer</Button>
        </Link>
      )}
    </Suspense>
  );
};

export default AuthButton;
