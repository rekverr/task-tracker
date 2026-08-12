import { Injectable } from '@nestjs/common';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const assigneeInclude = {
  assignee: { select: { id: true, email: true } },
} as const;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    deadline?: Date | null;
    projectId: string;
    assigneeId?: string;
  }) {
    return this.prisma.task.create({
      data,
      include: assigneeInclude,
    });
  }

  findManyWithCount(args: {
    where: Prisma.TaskWhereInput;
    skip: number;
    take: number;
  }) {
    return this.prisma.$transaction([
      this.prisma.task.findMany({
        skip: args.skip,
        take: args.take,
        where: args.where,
        orderBy: { createdAt: 'desc' },
        include: assigneeInclude,
      }),
      this.prisma.task.count({ where: args.where }),
    ]);
  }

  findById(taskId: string) {
    return this.prisma.task.findUnique({ where: { id: taskId } });
  }

  findByIdWithProject(taskId: string) {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
  }

  update(
    taskId: string,
    data: Prisma.TaskUpdateInput,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    return tx.task.update({
      where: { id: taskId },
      data,
      include: assigneeInclude,
    });
  }

  delete(taskId: string) {
    return this.prisma.task.delete({ where: { id: taskId } });
  }

  createHistory(
    data: {
      taskId: string;
      userId: string;
      oldStatus: TaskStatus;
      newStatus: TaskStatus;
    },
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    return tx.taskHistory.create({ data });
  }

  findHistory(taskId: string) {
    return this.prisma.taskHistory.findMany({
      where: { taskId },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { changedAt: 'desc' },
    });
  }

  runTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }
}
