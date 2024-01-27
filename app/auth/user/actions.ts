"use server";

import userService from "@/services/user.services";
import Supabase from "@/utils/supabase/server-action";

export async function syncUser() {
  const { data: { user } } = await Supabase().auth.getUser();
  user ? userService.setUser(user) : userService.logout();
}
