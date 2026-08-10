import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}