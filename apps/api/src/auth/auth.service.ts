import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { userPublicSelect } from '../users/user.select';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private signToken(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.sign(payload);
  }

  async register(dto: RegisterDto) {
    const existed = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existed) throw new BadRequestException('Email already exists');

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        fullName: dto.fullName,
        role: (dto.role as any) ?? 'CANDIDATE',
      },
      select: userPublicSelect,
    });
  }

  async login(dto: LoginDto) {
    const userFound = await this.prisma.user.findUnique({ 
      where: { email: dto.email }
    });
    if (!userFound) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, userFound.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const access_token = this.signToken({ id: userFound.id, email: userFound.email, role: userFound.role as any });
    
    // Create public user object for response
    const { password, ...user } = userFound;
    
    return { access_token, user };
  }
}
