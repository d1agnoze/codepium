import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import DrawerHost from "@/components/navigation-bar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Codepium 🐸",
  description: "print('welcome to codepium!')",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const canInitSupabaseClient = () => {
    try {
      createServerComponentClient({ cookies: () => cookieStore });
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen flex flex-col">
            <div className="navbar bg-card">
              <div className="flex-1">
                <a className="btn btn-ghost text-xl">Codepium</a>
              </div>
              <div className="flex-none gap-2">
                <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                {isSupabaseConnected && <AuthButton />}
                <ModeToggle />
                <DrawerHost />
              </div>
            </div>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html >
  );
}
