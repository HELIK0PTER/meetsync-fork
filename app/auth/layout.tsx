import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <Link
        href="/"
        className="text-2xl font-bold p-3 absolute top-5 left-10"
      >
        MEETSYNC
      </Link>
      {children}
    </div>
  );
}
