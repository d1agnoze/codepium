export type User = {
  id: string;
  created_at: string;
  user_name: string;
  display_name: string;
  role: "admin" | "member";
  email: string;
  about: string;
  background_image: string;
};
