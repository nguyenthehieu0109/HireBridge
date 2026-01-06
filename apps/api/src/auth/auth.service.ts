import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { userPublicSelect } from '../users/user.select';
import { MailService } from './mail.service';
import { OtpService } from './otp.service';
import { TurnstileService } from './turnstile.service';
import { OtpType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService,
    private mail: MailService,
    private otp: OtpService,
    private turnstile: TurnstileService
  ) {}

  private signToken(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.sign(payload);
  }

  async register(dto: RegisterDto) {
    const existed = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existed) throw new BadRequestException('Email này đã được sử dụng');

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        fullName: dto.fullName,
        role: (dto.role as any) ?? 'CANDIDATE',
        emailVerified: false, // Default to false until verified
      },
      select: userPublicSelect,
    });

    const code = await this.otp.createOtp(user.email, OtpType.EMAIL_VERIFY, user.id);
    await this.mail.sendOtpEmail(user.email, code, 'verify');

    return { message: 'OTP sent to email', user };
  }

  async verifyEmail(email: string, code: string) {
    await this.otp.verifyOtp(email, OtpType.EMAIL_VERIFY, code);

    const user = await this.prisma.user.update({
      where: { email },
      data: { emailVerified: true },
      select: userPublicSelect,
    });

    return { message: 'Email verified', user };
  }

  async login(dto: LoginDto) {
    const userFound = await this.prisma.user.findUnique({ 
      where: { email: dto.email }
    });
    if (!userFound) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    const ok = await bcrypt.compare(dto.password, userFound.password);
    if (!ok) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    // Option: check emailVerified if you want to force verification before login
    // if (!userFound.emailVerified) throw new UnauthorizedException('Vui lòng xác minh email trước khi đăng nhập');

    const access_token = this.signToken({ id: userFound.id, email: userFound.email, role: userFound.role as any });
    
    const { password, ...user } = userFound;
    return { access_token, user };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    // Always return success to avoid email enumeration
    if (user) {
      const code = await this.otp.createOtp(email, OtpType.PASSWORD_RESET, user.id);
      await this.mail.sendOtpEmail(email, code, 'reset');
    }
    
    return { message: 'Nếu email tồn tại, một mã xác minh đã được gửi.' };
  }

  async resetPassword(dto: { email: string; code: string; password?: string }) {
    await this.otp.verifyOtp(dto.email, OtpType.PASSWORD_RESET, dto.code);

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('Yêu cầu không hợp lệ');

    if (dto.password) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);
        await this.prisma.user.update({
          where: { email: dto.email },
          data: { password: hashed },
        });
    }

    return { message: 'Mật khẩu đã được cập nhật thành công.' };
  }
}
