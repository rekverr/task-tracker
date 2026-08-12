import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const authorInclude = {
  author: { select: { id: true, email: true } },
} as const;

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { text: string; taskId: string; authorId: string }) {
    return this.prisma.comment.create({
      data,
      include: authorInclude,
    });
  }

  findByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: authorInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(commentId: string) {
    return this.prisma.comment.findUnique({ where: { id: commentId } });
  }

  update(commentId: string, text: string) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { text },
      include: authorInclude,
    });
  }

  delete(commentId: string) {
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
