export type Question = {
  id: string;
  created_at: Date;

  title: string;
  content: string;
  tag: string[];

  stars: number;
  status: boolean;

  user_id?: string;
  user_name?: string;
  email?: string;

  isArchieved?: boolean;
  archieveReason?: string;
  isEdited?: boolean;
};
