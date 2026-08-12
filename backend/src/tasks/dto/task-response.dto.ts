import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { UserPublicDto } from '../../common/dto/user-public.dto';

type TaskEntity = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date | null;
  assignee?: { id: string; email: string } | null;
};

export class TaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: TaskStatus })
  status!: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  priority!: TaskPriority;

  @ApiProperty()
  projectId!: string;

  @ApiPropertyOptional({ nullable: true })
  assigneeId!: string | null;

  @ApiPropertyOptional({ type: UserPublicDto, nullable: true })
  assignee!: UserPublicDto | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  deadline!: Date | null;

  static from(task: TaskEntity): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      assignee: task.assignee ? UserPublicDto.from(task.assignee) : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deadline: task.deadline,
    };
  }
}

export class TaskHistoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  taskId!: string;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional({ enum: TaskStatus, nullable: true })
  oldStatus!: TaskStatus | null;

  @ApiProperty({ enum: TaskStatus })
  newStatus!: TaskStatus;

  @ApiProperty()
  changedAt!: Date;

  @ApiProperty({ type: UserPublicDto })
  user!: UserPublicDto;

  static from(entry: {
    id: string;
    taskId: string;
    userId: string;
    oldStatus: TaskStatus | null;
    newStatus: TaskStatus;
    changedAt: Date;
    user: { id: string; email: string };
  }): TaskHistoryResponseDto {
    return {
      id: entry.id,
      taskId: entry.taskId,
      userId: entry.userId,
      oldStatus: entry.oldStatus,
      newStatus: entry.newStatus,
      changedAt: entry.changedAt,
      user: UserPublicDto.from(entry.user),
    };
  }
}
