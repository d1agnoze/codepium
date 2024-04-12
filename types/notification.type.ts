export type notification = {
  id: string;

  message: string;

  thread_ref: string | null;
  source_ref: string | null;

  sender: string;

  created_at: string;
};
