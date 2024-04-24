import { PAGINATION_SETTINGS } from "@/defaults/browsing_paginatioin";

export function paginationCalulator(num: number, bound: number): number[] {
  if (num <= 0 || bound <= 0 || num > bound) return [];

  const result: number[] = [];
  const start = Math.max(1, Math.min(bound - 2, num - 1));
  const end = Math.min(bound, start + 2);

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
}

export const getPagination = (page: number, size: number) => {
  const limit = size ? size : PAGINATION_SETTINGS.limit;
  const from = page ? (page - 1) * limit : PAGINATION_SETTINGS.page;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};
