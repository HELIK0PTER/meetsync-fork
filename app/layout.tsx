import "./globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import DynamicBackground from "./components/DynamicBackground";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr" className="scroll-smooth">
      <head />
      <body
        cz-shortcut-listen="true"
        className={clsx(
          "min-h-screen bg-background font-sans antialiased overflow-y-scroll",
          fontSans.variable,
        )}
      >
        <Providers>
          <div className="relative flex flex-col items-center h-screen w-full">
            <DynamicBackground />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
