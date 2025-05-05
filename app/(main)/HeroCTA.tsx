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
      <Button color="secondary" size="lg" isLoading className="text-lg px-8 py-6">
        Chargement...
      </Button>
    );

  if (user)
    return (
      <Link
        href="/dashboard"
        className="
          inline-flex items-center justify-center
          px-8 py-4 text-lg font-semibold
          bg-gradient-to-r from-pink-500 to-purple-600
          text-white rounded-xl
          transform transition-all duration-300
          hover:scale-105 hover:shadow-xl
          active:scale-95
        "
      >
        Tableau de bord
      </Link>
    );
  else
    return (
      <Link
        href="/auth/login"
        className="
          inline-flex items-center justify-center
          px-8 py-4 text-lg font-semibold
          bg-gradient-to-r from-pink-500 to-purple-600
          text-white rounded-xl
          transform transition-all duration-300
          hover:scale-105 hover:shadow-xl
          active:scale-95
          relative overflow-hidden
          before:absolute before:inset-0
          before:bg-gradient-to-r before:from-purple-600 before:to-pink-500
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
        "
      >
        <span className="relative z-10">Commencer gratuitement</span>
      </Link>
    );
}
