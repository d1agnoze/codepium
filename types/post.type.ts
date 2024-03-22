export type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  tag: string[];
  user_id: string;
  likes: number;
  user_name: string;
  email: string;
};
