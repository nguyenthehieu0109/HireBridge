import { IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsOptional() @IsString()
  location?: string;

  @IsOptional() @IsString()
  level?: string;

  @IsOptional() @IsString()
  description?: string;
}
