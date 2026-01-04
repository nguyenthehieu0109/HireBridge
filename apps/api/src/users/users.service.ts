import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Helper: Xóa password khỏi object user
  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password, // Tạm thời plain text
        fullName: dto.fullName,
        role: dto.role ?? 'CANDIDATE',
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    // 1. Check user exists
    await this.findOne(id);

    // 2. Nếu update email -> check trùng
    if (dto.email) {
      const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (exists && exists.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    // 3. Update
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return this.sanitizeUser(updated);
  }

  async remove(id: string) {
    await this.findOne(id); // Check exist
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
