"use client"
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ThemeSupa,
} from '@supabase/auth-ui-shared'

export default function Login() {
  const supabase = createClientComponentClient()
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['facebook', 'github']}
          theme="dark"
          redirectTo={`${window.location.origin}/auth/callback`}
          // onlyThirdPartyProviders
        />
      </Auth.UserContextProvider>
    </div>
  )

}
