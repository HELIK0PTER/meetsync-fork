import "./globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { UserProvider } from "@/lib/UserContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AppWrapper } from "@/components/AppWrapper";

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
    <html suppressHydrationWarning lang="fr">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased overflow-y-scroll",
          fontSans.variable,
        )}
      >
        <UserProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col items-center h-screen">
              <Navbar />
              <main className="container flex-1">
                <AppWrapper>{children}</AppWrapper>
              </main>
              <Footer />
            </div>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
