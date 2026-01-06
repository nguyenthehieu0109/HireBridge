import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE) === "true", // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendOtpEmail(email: string, code: string, purpose: "REGISTER" | "RESET_PASSWORD") {
    const subject =
      purpose === "REGISTER"
        ? "Mã xác nhận đăng ký HireBridge"
        : "Mã xác nhận đặt lại mật khẩu HireBridge";

    const text = `Mã xác nhận của bạn là: ${code}. Mã có hiệu lực trong 10 phút.`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      text,
      html: `
        <div style="font-family:Arial,sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">${subject}</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">Chào bạn,</p>
          <p style="font-size: 16px; margin-bottom: 8px;">Mã xác nhận OTP của bạn là:</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #2563eb; background-color: #eff6ff; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #64748b;">Mã có hiệu lực trong <b>${process.env.OTP_EXPIRES_MINUTES || 10}</b> phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 HireBridge. All rights reserved.</p>
        </div>
      `,
    });
  }
}
