export type user_admin = {
  id: string;
  created_at: string;
  user_name: string;
  display_name: string;
  role: "admin" | "member";
  email: string;

  banned_until?: string;
};
