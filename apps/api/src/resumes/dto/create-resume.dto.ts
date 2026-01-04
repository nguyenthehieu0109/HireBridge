import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateResumeDto {
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
