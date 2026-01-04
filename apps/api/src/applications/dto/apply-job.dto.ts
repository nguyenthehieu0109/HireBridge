import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ApplyJobDto {
  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsUUID()
  resumeId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
