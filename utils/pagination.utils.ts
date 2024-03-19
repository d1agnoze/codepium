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
