import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme-toggle";
import DrawerHost from "@/components/navigation-bar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingProvider from "@/components/Loading";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Codepium 🐸",
  description: "print('welcome to codepium!')",
};

export default function RootLayout(
  { children }: { children: React.ReactNode },
) {
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
                <div className="flex-1">
                  <a className="btn btn-ghost text-xl">Codepium</a>
                </div>
                <div className="flex-none gap-2">
                  <div className="form-control max-sm:hidden">
                    <Input
                      type="text"
                      placeholder="Search"
                      className="input input-bordered w-24 md:w-auto"
                    />
                  </div>
                  {isSupabaseConnected && <AuthButton />}
                  <div className="max-sm:hidden">
                    <ModeToggle />
                  </div>
                </div>
              </div>
              {children}
            </main>
            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme={"colored"}
            />
        </ThemeProvider>
      </body>
    </html>
  );
}
