"use client";
import { useUser } from "@/lib/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";
import { CircularProgress } from "@heroui/react";

export function AppWrapper({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname.startsWith("/dashboard")) {
      router.push("/auth/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress aria-label="Loading..." size="sm" color="danger" />
      </div>
    );
  }

  return <>{children}</>;
}
