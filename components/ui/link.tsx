import React from "react";

import Link from "next/link";
import { Link as HeroLink } from "@heroui/link";

import { cn } from "@/lib/utils";

// link component pour garder les fonctionnalités de next/link et le style de hero-ui
const NewLink = ({
  href,
  children,
  className,
  isDisabled,
  color,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  color?: string;
  props?: any;
}) => {
  if (isDisabled) {
    return (
      <HeroLink className={cn(className, "text-white")} isDisabled>
        {children}
      </HeroLink>
    );
  }
  return (
    <Link
      href={href}
      {...props}
      className={className}
      style={{ backgroundColor: color }}
    >
      {children}
    </Link>
  );
};

export { NewLink };
