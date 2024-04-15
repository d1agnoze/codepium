import { ZodError, ZodIssue } from "zod";

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join(",");

  return `${pathString}: ${message}`;
};

export const formatZodError = (error: ZodError): string => {
  const { issues } = error;

  if (issues.length) {
    return issues.map((item) => formatZodIssue(item)).join('\n');
  }
  return "Validation error";
};
