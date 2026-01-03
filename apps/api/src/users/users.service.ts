import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    // Demo: tạm lưu plain password để chạy được ngay.
    // Sau này mình sẽ nâng cấp sang bcrypt + auth chuẩn.
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        fullName: dto.fullName,
        role: dto.role ?? 'CANDIDATE',
      },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
