export type Comment_Optimistic = {
  id: string;
  receviver: string;
  username: string;
  user_email: string;
  content: string;
  created_at: string;
};

export const INITIAL_COMMENT_OPTIMISTIC: Comment_Optimistic = {
  id: "",
  receviver: "",
  username: "",
  user_email: "",
  content: "",
  created_at: "",
};
