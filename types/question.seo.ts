export type question_seo = {
  stars: number;
  title: string;
  status: boolean;
  id: string;
  tag: string[];
  tags: { id: string; name: string }[];
  created_at: string;
  answer_count: number;
};
