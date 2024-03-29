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
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { showLoading } from "@/utils/loading.service";
import nProgress from "nprogress";
import { toast } from "react-toastify";
import userService from "@/services/user.services";

export default function AuthButton() {
  const [log, setLog] = useState<User | null>(null);
  const router = useRouter();
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    userService.subscribe((data) => {
      if (data) setLog(data);
    });
  }, []);
  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then((data) => setLog(data.data.user));
  }, [refetch]);

  const onSubmit = () => {
    signOut().finally(() => {
      router.replace("/");
      nProgress.done();

      setRefetch(!refetch);
      toast.info("you have signed out");
    });
  };

  return log
    ? (
      <div className="flex py-3 max-h-9 items-center gap-4">
        <Avatar>
          <AvatarImage
            className="cursor-pointer"
            onClick={() => {
              showLoading();
              router.push("/profile");
            }}
            src={`https://gravatar.com/avatar/${
              sha256(log!.email!.trim().toLowerCase())
            }?d=${encodeURIComponent(DEFAULT_AVATAR)}&s=100`}
          />
          <AvatarFallback>{log.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <form action={onSubmit}>
          <button
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-hslvar"
            onClick={() => nProgress.start()}
          >
            Logout
          </button>
        </form>
      </div>
    )
    : (
      <Link
        prefetch
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-primary hover:text-primary-foreground transition-all"
      >
        Login
      </Link>
    );
}
