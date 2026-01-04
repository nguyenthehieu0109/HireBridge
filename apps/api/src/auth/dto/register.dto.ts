import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum RoleDto {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(RoleDto)
  role?: RoleDto; // default CANDIDATE nếu không gửi
}
