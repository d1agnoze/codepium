export type post_admin = {
  likes: number;
  title: string;
  id: string;
  tags: Expertise[];
  tag: string[];
  created_at: string;

  user_id: string;

  isDeleted: boolean;
};
