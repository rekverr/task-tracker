import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkspacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, name: string) {
    return this.prisma.workspace.create({
      data: {
        name,
        ownerId: userId,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: { owner: { select: { id: true, email: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findByIdDetailed(workspaceId: string) {
    return this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        owner: { select: { id: true, email: true } },
        members: {
          include: { user: { select: { id: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  findById(workspaceId: string) {
    return this.prisma.workspace.findUnique({ where: { id: workspaceId } });
  }

  update(workspaceId: string, data: { name?: string }) {
    return this.prisma.workspace.update({ where: { id: workspaceId }, data });
  }

  delete(workspaceId: string) {
    return this.prisma.workspace.delete({ where: { id: workspaceId } });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createMember(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.create({
      data: { workspaceId, userId, role: 'MEMBER' },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  findMember(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  }

  deleteMember(memberId: string) {
    return this.prisma.workspaceMember.delete({ where: { id: memberId } });
  }
}
