"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { createClient } from "@/utils/supabase/client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@heroui/button";

export default function HeroCTA() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
    setLoading(false);
  }, []);

  if (loading)
    return (
      <Button color="secondary" isLoading>
        {" "}
        Chargement...{" "}
      </Button>
    );

  if (user)
    return (
      <Link href="/dashboard" className={buttonStyles({ color: "secondary" })}>
        Tableau de bord
      </Link>
    );
  else
    return (
      <Link href="/auth/login" className={buttonStyles({ color: "secondary" })}>
        Commencer gratuitement
      </Link>
    );
}
