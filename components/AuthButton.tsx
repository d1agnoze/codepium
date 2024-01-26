"use client";
import Link from "next/link";
import { sha256 } from "js-sha256";
import { DEFAULT_AVATAR } from "@/defaults/profile";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { signOut } from "@/app/login/actions";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/loading";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AuthButton() {
  const [log, setLog] = useState<User | null>(null);
  const { set_loading } = useLoading();
  const router = useRouter();
  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then((data) => setLog(data.data.user));
  }, []);
  const onSubmit = () => {
    set_loading(true);
    signOut().finally(() => {
      setLog(null);
      set_loading(false);
      router.replace("/");
      router.refresh();
    });
  };
  return log
    ? (
      <div className="flex py-3 max-h-9 items-center gap-4">
        <Avatar>
          <AvatarImage
            className="cursor-pointer"
            onClick={() => router.push("/profile")}
            src={`https://gravatar.com/avatar/${
              sha256(log!.email!.trim().toLowerCase())
            }?d=${encodeURIComponent(DEFAULT_AVATAR)}&s=100`}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <form action={onSubmit}>
          <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>
      </div>
    )
    : (
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-primary hover:text-primary-foreground transition-all"
      >
        Login
      </Link>
    );
}
