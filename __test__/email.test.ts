import { EmailService } from "@/services/email.service";
import { describe, test } from "vitest";

describe("EmailService", () => {
  const email = new EmailService();
  test("Revoke ban email testing", async () => {
    await email.sendRevokBanEmail("dacvuong202@gmail.com", "vdac");
  });
});
