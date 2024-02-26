export function isValueInStringEnum<E extends string>(
  strEnum: Record<string, E>,
) {
  const enumValues = Object.values(strEnum) as string[];

  return (value: string): value is E => enumValues.includes(value);
}
