import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  async sendOtpEmail(to: string, code: string, purpose: 'verify' | 'reset') {
    const subject =
      purpose === 'verify' ? 'HireBridge - Mã xác minh email' : 'HireBridge - Mã đặt lại mật khẩu';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background-color:#0f172a;padding:24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-style:italic;">HireBridge</h1>
        </div>
        <div style="padding:32px;background-color:#ffffff;">
          <h2 style="color:#1e293b;margin-top:0;">${subject}</h2>
          <p style="color:#475569;font-size:16px;">Chào bạn,</p>
          <p style="color:#475569;font-size:16px;">Bạn vừa yêu cầu mã xác minh cho tài khoản HireBridge. Vui lòng sử dụng mã dưới đây:</p>
          <div style="background-color:#f1f5f9;border-radius:8px;padding:24px;text-align:center;margin:32px 0;">
            <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#0f172a;">${code}</span>
          </div>
          <p style="color:#64748b;font-size:14px;">Mã này có hiệu lực trong vòng <b>10 phút</b>. Nếu không phải bạn yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
        <div style="background-color:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">&copy; 2026 HireBridge AI Recruitment. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
        await this.transporter.sendMail({
          from: `"HireBridge" <${process.env.GMAIL_USER}>`,
          to,
          subject,
          html,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        // In local development, we might not want to throw if SMTP is not configured
        if (process.env.NODE_ENV === 'production') {
            throw error;
        }
    }
  }
}
