import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        owner: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async inviteUser(ownerId: string, workspaceId: string, email: string) {
    const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
    
    if (!workspace || workspace.ownerId !== ownerId) {
      throw new ForbiddenException('Only the workspace owner can invite members');
    }

    const userToInvite = await this.prisma.user.findUnique({ where: { email } });
    if (!userToInvite) throw new NotFoundException('User with this email not found');

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: userToInvite.id,
        role: 'MEMBER',
      },
    });
  }
}