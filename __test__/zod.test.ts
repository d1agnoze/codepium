import { EmailService } from "@/services/email.service";
import { formatZodError } from "@/utils/zodErrorHandler";
import { describe, expect, test } from "vitest";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";

describe("Zod utils test", () => {
  const issue: ZodIssue = {
    code: ZodIssueCode.invalid_type,
    expected: "number",
    received: "null",
    path: ["user", "name"],
    message: "Expected number, received null",
  };
  const issue2: ZodIssue = {
    validation: "uuid", 
    code: ZodIssueCode.invalid_string,
    path: ["id"],
    message: "Expected number, received null",
  };

  const error = new ZodError([issue, issue2]);
  test("zod error handler test", () => {
    const msg = formatZodError(error);
    console.log(msg);
    expect(msg).not.toEqual("Validation error");
  });
});
