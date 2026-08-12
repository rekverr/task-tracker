import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { MembershipRepository } from '../common/repositories/membership.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import {
  TaskHistoryResponseDto,
  TaskResponseDto,
} from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    await this.checkProjectAccess(userId, dto.projectId);
    await this.ensureAssigneeInProject(dto.assigneeId, dto.projectId);

    const task = await this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      projectId: dto.projectId,
      assigneeId: dto.assigneeId,
    });

    const response = TaskResponseDto.from(task);
    this.tasksGateway.emitTaskCreated(dto.projectId, response);
    return response;
  }

  async findAll(userId: string, projectId: string, query: TaskQueryDto) {
    await this.checkProjectAccess(userId, projectId);

    const page = { skip: query.skip ?? 0, take: query.take ?? 10 };
    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(query.status && { status: query.status }),
      ...(query.assigneeId && { assigneeId: query.assigneeId }),
      ...(query.priority && { priority: query.priority }),
    };

    const [items, total] = await this.tasksRepository.findManyWithCount({
      where,
      ...page,
    });

    return PaginatedResponseDto.of(
      items.map((item) => TaskResponseDto.from(item)),
      { total, skip: page.skip, take: page.take },
    );
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.tasksRepository.findByIdWithProject(taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.checkProjectAccess(userId, task.projectId);
    await this.ensureAssigneeInProject(dto.assigneeId, task.projectId);

    const { deadline, ...taskData } = dto;
    const updatedTask = await this.tasksRepository.runTransaction(async (tx) => {
      if (dto.status && dto.status !== task.status) {
        await this.tasksRepository.createHistory(
          {
            taskId: task.id,
            userId,
            oldStatus: task.status,
            newStatus: dto.status,
          },
          tx,
        );
      }
      return this.tasksRepository.update(
        taskId,
        {
          ...taskData,
          ...(deadline !== undefined && {
            deadline: deadline ? new Date(deadline) : null,
          }),
        },
        tx,
      );
    });

    const response = TaskResponseDto.from(updatedTask);
    this.tasksGateway.emitTaskUpdated(task.projectId, response);
    return response;
  }

  async remove(userId: string, taskId: string) {
    const task = await this.findTaskWithProject(taskId);
    await this.checkProjectAccess(userId, task.projectId);
    await this.tasksRepository.delete(taskId);
    this.tasksGateway.emitTaskDeleted(task.projectId, taskId);
  }

  async findHistory(userId: string, taskId: string) {
    const task = await this.findTaskWithProject(taskId);
    await this.checkProjectAccess(userId, task.projectId);
    const history = await this.tasksRepository.findHistory(taskId);
    return history.map((entry) => TaskHistoryResponseDto.from(entry));
  }

  private async checkProjectAccess(userId: string, projectId: string) {
    const project =
      await this.membershipRepository.findProjectWorkspace(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const membership = await this.membershipRepository.findMembership(
      project.workspaceId,
      userId,
    );
    if (!membership)
      throw new ForbiddenException('Access denied to this project');
  }

  private async findTaskWithProject(taskId: string) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private async ensureAssigneeInProject(
    assigneeId: string | undefined,
    projectId: string,
  ) {
    if (!assigneeId) return;
    const project =
      await this.membershipRepository.findProjectWorkspace(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const membership = await this.membershipRepository.findMembership(
      project.workspaceId,
      assigneeId,
    );
    if (!membership)
      throw new BadRequestException(
        'Assignee must be a member of the project workspace',
      );
  }
}
