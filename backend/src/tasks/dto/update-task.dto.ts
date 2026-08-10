import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}