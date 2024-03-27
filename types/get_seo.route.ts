export type Result<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
