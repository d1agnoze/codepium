import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme-toggle";
import DrawerHost from "@/components/navigation-bar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingProvider from "@/components/Loading";
import Link from "next/link";
import { Suspense } from "react";
import { NavigationEvents } from "@/components/NavigationEvents";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Codepium 🐸",
  description: "print('welcome to codepium!')",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="relative bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider />
          <div className="fixed bottom-2 right-2 z-20">
            <DrawerHost />
          </div>
          <main className="min-h-screen flex flex-col">
            <div className="navbar bg-card">
              <div className="flex-1 max-md:flex-row-reverse">
                <Link className="btn btn-ghost text-xl" href={"/"}>
                  Codepium
                </Link>
              </div>
              <div className="flex-none gap-2">
                {isSupabaseConnected && <AuthButton />}
                <div className="max-sm:hidden">
                  <ModeToggle />
                </div>
              </div>
            </div>
            {children}
          </main>
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>

          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            transition={Flip}
            pauseOnHover
            theme={"dark"}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
