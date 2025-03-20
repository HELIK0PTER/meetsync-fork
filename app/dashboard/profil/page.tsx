"use client";
import { Button, Card, CardFooter, Image } from "@heroui/react";
import { useUser } from "@/lib/UserContext";

export default function Dashboard() {
  const { user, loading } = useUser();
  return (
    <div className="flex items-center justify-center m-auto  w-full h-full min-h-screen">
      <Card isFooterBlurred className="border-none" radius="lg">
        <Image
          alt="Woman listing to music"
          className="object-cover"
          height={200}
          src={user.user_metadata?.avatar_url}
          width={200}
        />
        <CardFooter className="border-b-amber-50 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-white/80">
            {user.user_metadata?.full_name}{" "}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
