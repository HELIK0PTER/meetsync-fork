"use client";

import React, { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { Avatar } from "@heroui/avatar";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { FiLogOut } from "react-icons/fi";

import { CgProfile } from "react-icons/cg";

import { User } from "@supabase/supabase-js";

import { cn } from "@/lib/utils";

const iconClasses =
"text-xl text-default-500 pointer-events-none flex-shrink-0";

const AuthButton = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);


  if (!user) {
    return null;
  }

  return (
    <Dropdown shouldBlockScroll={false}>
      <DropdownTrigger>
        <div className="flex items-center gap-2 p-2 hover:cursor-pointer">
          <Avatar src={user.user_metadata?.avatar_url} isBordered />
          <span className="text-md">
            {user.user_metadata?.username || user.user_metadata?.full_name}
          </span>
        </div>
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
  );
};

export default AuthButton;
