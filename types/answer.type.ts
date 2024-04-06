export type Answer = {
  thread_ref: string;
  source_ref: string;

  created_at: string;
  content: string;

  source_user_id: string;

  user_id: string;
  user_email: string;
  user_name: string;

  stars: number;
  status: boolean;

  isEdited?: boolean;
  isDeleted?: boolean;

  point?: number; //user reputation
};
