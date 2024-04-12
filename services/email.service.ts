import { BanRevoke } from "@/components/email/ban-revoke.template";
import { BanTemplate } from "@/components/email/ban.template";
import { Resend } from "resend";

export class EmailService {
  private resend: Resend;
  constructor() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Missing RESEND_API_KEY");
    this.resend = new Resend(key);
  }
  async sendBanNotification(
    email: string,
    userName: string,
    duration: string,
    reason: string,
  ) {
    try {
      const { error } = await this.resend.emails.send({
        from: "Codepium <codepium-team@resend.dev>",
        to: [email],
        subject: "About your ban on codepium",
        text: "Your account ban has been revoked",
        react: BanTemplate({ userName, duration, reason }),
      });

      if (error) throw new Error(error.message);
    } catch (err: any) {
      throw err;
    }
  }

  async sendRevokBanEmail(email: string, userName: string) {
    try {
      const { error } = await this.resend.emails.send({
        from: "Codepium <codepium-team@resend.dev>",
        to: [email],
        subject: "About your ban on codepium",
        text: "Your account ban has been revoked",
        react: BanRevoke({ userName }),
      });

      if (error) throw new Error(error.message);
    } catch (err: any) {
      throw err;
    }
  }
}
