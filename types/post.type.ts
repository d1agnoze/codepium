export type Post = {
  id: string;
  created_at: string;

  title: string;
  content: string;

  tag: string[];
  likes: number;

  user_id: string;
  user_name: string;
  email: string;

  isEdited?: boolean;
  isDeleted?: boolean;
};
