import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { OtpType } from "@prisma/client";

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  private otpMinutes() {
    return Number(process.env.OTP_EXPIRES_MINUTES || 10);
  }

  private generateRandomCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async createOtp(email: string, type: OtpType, userId?: string) {
    const code = this.generateRandomCode();
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const codeHash = await bcrypt.hash(code, saltRounds);

    const expiresAt = new Date(Date.now() + this.otpMinutes() * 60 * 1000);

    // Mark previous OTPs as used or delete them for same type/email
    await this.prisma.otpToken.updateMany({
      where: { 
        email, 
        type,
        usedAt: null
      },
      data: {
        usedAt: new Date()
      }
    });

    await this.prisma.otpToken.create({
      data: { 
        email, 
        userId,
        type, 
        codeHash, 
        expiresAt 
      },
    });

    return code;
  }

  async verifyOtp(email: string, type: OtpType, code: string) {
    const token = await this.prisma.otpToken.findFirst({
      where: { 
        email, 
        type, 
        usedAt: null 
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });

    if (!token) {
        throw new BadRequestException("Mã OTP không tồn tại hoặc đã được sử dụng");
    }

    if (token.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("Mã OTP đã hết hạn");
    }

    const ok = await bcrypt.compare(code, token.codeHash);
    if (!ok) {
      throw new BadRequestException("Mã OTP không chính xác");
    }

    await this.prisma.otpToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    return true;
  }
}
