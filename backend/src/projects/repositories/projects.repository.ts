import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; workspaceId: string }) {
    return this.prisma.project.create({ data });
  }

  findByWorkspace(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findById(projectId: string) {
    return this.prisma.project.findUnique({ where: { id: projectId } });
  }

  update(projectId: string, data: { name?: string }) {
    return this.prisma.project.update({ where: { id: projectId }, data });
  }

  delete(projectId: string) {
    return this.prisma.project.delete({ where: { id: projectId } });
  }
}
