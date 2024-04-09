"use client";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*IMPORTANT: Keep in sync with NavbarIndexes*/
const NavbarIndexes: { url: string; label: string }[] = [
  { url: "user", label: "Users" },
  { url: "expertise", label: "Expertises" },
  { url: "question", label: "Questions" },
  { url: "post", label: "Posts" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const current = usePathname();
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
          <Link
            href="/admin/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Codepium</span>
          </Link>
          {NavbarIndexes.map((item) => (
            <Link
              href={`/admin/${item.url}`}
              className={`text-${current.startsWith(`/admin/${item.url}`) ? "" : "muted-"}foreground transition-colors hover:text-foreground`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-8 py-3">
        {children}
      </main>
    </>
  );
}
