export type post_seo = {
  likes: number;
  title: string;
  id: string;
  tags: { id: string; name: string }[];
  tag: string[];
  created_at: string;

  user_id: string;
  display_name: string;
  user_name: string;
  email: string;
  background_image: string;
};
