import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Prepare homepage mockups' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Create desktop and mobile variations.' })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-09-01T12:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: '5cdd8953-f434-4d37-839c-528e332e322a' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiPropertyOptional({ example: '89c5e7d3-2b9c-4e39-bfba-9b1b7f94aa16' })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
