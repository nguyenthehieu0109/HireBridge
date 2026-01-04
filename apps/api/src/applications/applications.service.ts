import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(dto: ApplyJobDto, userId: string) {
    // 1. Check if job exists
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');

    // 2. Check duplicate application
    const exists = await this.prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId: dto.jobId } },
    });
    if (exists) throw new BadRequestException('You already applied to this job');

    // 3. Resolve resumeId
    let resumeId = dto.resumeId;
    if (!resumeId) {
      const defaultResume = await this.prisma.resume.findFirst({
        where: { userId, isDefault: true },
      });
      if (!defaultResume) throw new BadRequestException('Please provide a resume or set a default one');
      resumeId = defaultResume.id;
    }

    // 4. Create application
    return this.prisma.application.create({
      data: {
        userId,
        jobId: dto.jobId,
        resumeId,
        note: dto.note,
        status: ApplicationStatus.APPLIED,
      },
    });
  }

  findMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: { select: { title: true, location: true } },
        resume: { select: { fileName: true, fileUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string, recruiterId: string) {
    // Check job ownership (unless admin, but here we assume recruiter)
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.createdById !== recruiterId) {
      throw new ForbiddenException('You do not have permission to view applications for this job');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        user: { select: { fullName: true, email: true } },
        resume: { select: { fileName: true, fileUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus, recruiterId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application) throw new NotFoundException('Application not found');

    // Check ownership of the job
    if (application.job.createdById !== recruiterId) {
       throw new ForbiddenException('You do not have permission to update this application');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
