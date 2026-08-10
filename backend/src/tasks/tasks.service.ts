import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, TaskPriority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    await this.checkProjectAccess(userId, dto.projectId);

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        projectId: dto.projectId,
        assigneeId: dto.assigneeId,
      },
    });
  }

  async findAll(
    userId: string, 
    projectId: string, 
    status?: TaskStatus, 
    assigneeId?: string, 
    priority?: TaskPriority
  ) {
    await this.checkProjectAccess(userId, projectId);

    return this.prisma.task.findMany({
      where: {
        projectId,
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
        ...(priority && { priority }),
      },
      orderBy: { createdAt: 'desc' },
      include: { assignee: { select: { id: true, email: true } } }
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) throw new NotFoundException('Task not found');
    
    await this.checkProjectAccess(userId, task.projectId);

    if (dto.status && dto.status !== task.status) {
      await this.prisma.taskHistory.create({
        data: {
          taskId: task.id,
          userId: userId,
          oldStatus: task.status,
          newStatus: dto.status,
        }
      });
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });
  }

  private async checkProjectAccess(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: userId,
        },
      },
    });

    if (!membership) throw new ForbiddenException('Access denied to this project');
  }
}