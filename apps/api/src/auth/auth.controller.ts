import { Body, Controller, Get, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import type { Request } from 'express';
import { TurnstileService } from './turnstile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private turnstile: TurnstileService
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto & { turnstileToken?: string }, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const verify = await this.turnstile.verify(dto.turnstileToken, ip);
    if (!verify.success) throw new BadRequestException('Xác thực Captcha thất bại');

    return this.auth.register(dto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.auth.verifyEmail(body.email, body.code);
  }

  @Post('login')
  async login(@Body() dto: LoginDto & { turnstileToken?: string }, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const verify = await this.turnstile.verify(dto.turnstileToken, ip);
    if (!verify.success) throw new BadRequestException('Xác thực Captcha thất bại');

    return this.auth.login(dto);
  }

  @Post('request-password-reset')
  async requestReset(@Body() body: { email: string; turnstileToken?: string }, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const verify = await this.turnstile.verify(body.turnstileToken, ip);
    if (!verify.success) throw new BadRequestException('Xác thực Captcha thất bại');

    return this.auth.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; password?: string }) {
    return this.auth.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user; 
  }
}
