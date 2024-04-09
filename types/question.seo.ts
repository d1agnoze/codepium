export type question_seo = {
  id: string;
  title: string;
  stars: number;
  status: boolean;
  user_id: string;

  tag: string[];
  tags: { id: string; name: string }[];

  created_at: string;
  answer_count: number;
};
