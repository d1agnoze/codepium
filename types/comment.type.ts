export type comment = {
  id: string;
  created_at: string;
  content: string;

  user_id: string;
  reply_to: string;

  user_name: string;
  receiver_name: string;

  thread_ref: string;
  parent_ref: string;

  mode: string;
  host_id: string;

  isDeleted?: boolean;
  isEdited?: boolean;
};
