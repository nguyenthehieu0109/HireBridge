import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResumeDto, userId: string) {
    // Nếu đây là resume đầu tiên hoặc dto.isDefault = true, 
    // ta cần xử lý logic set default.
    const count = await this.prisma.resume.count({ where: { userId } });
    const isFirst = count === 0;
    const shouldBeDefault = isFirst || dto.isDefault;

    if (shouldBeDefault) {
      await this.prisma.resume.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.resume.create({
      data: {
        fileUrl: dto.fileUrl,
        fileName: dto.fileName || 'Untitled',
        userId,
        isDefault: shouldBeDefault,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        isDefault: true,
      },
    });
  }

  async createFromUpload(userId: string, data: {
    fileName: string;
    fileUrl: string;
    mimeType?: string;
    size?: number;
    isDefault?: boolean;
  }) {
    // Logic set default
    const count = await this.prisma.resume.count({ where: { userId } });
    const isFirst = count === 0;
    const shouldBeDefault = isFirst || data.isDefault;

    if (shouldBeDefault) {
      return this.prisma.$transaction(async (tx) => {
        await tx.resume.updateMany({
          where: { userId },
          data: { isDefault: false },
        });

        return tx.resume.create({
          data: {
            userId,
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            mimeType: data.mimeType,
            size: data.size,
            isDefault: true,
          },
        });
      });
    }

    return this.prisma.resume.create({
      data: {
        userId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        mimeType: data.mimeType,
        size: data.size,
        isDefault: false,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setDefault(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({ where: { id, userId } });
    if (!resume) throw new NotFoundException('Resume not found');

    return this.prisma.$transaction([
      this.prisma.resume.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      this.prisma.resume.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
  }

  async remove(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({ where: { id, userId } });
    if (!resume) throw new NotFoundException('Resume not found');
    return this.prisma.resume.delete({ where: { id } });
  }
}
