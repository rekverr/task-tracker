import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';
import {
  WorkspaceMemberInviteResponseDto,
  WorkspaceResponseDto,
} from './dto/workspace-response.dto';
import { WorkspacesRepository } from './repositories/workspaces.repository';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    const workspace = await this.workspacesRepository.create(userId, dto.name);
    return WorkspaceResponseDto.from(workspace);
  }

  async findAllForUser(userId: string) {
    const workspaces = await this.workspacesRepository.findAllForUser(userId);
    return workspaces.map((workspace) => WorkspaceResponseDto.from(workspace));
  }

  async findOne(userId: string, workspaceId: string) {
    const workspace =
      await this.workspacesRepository.findByIdDetailed(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    await this.ensureMembership(userId, workspaceId);
    return WorkspaceResponseDto.from(workspace);
  }

  async update(userId: string, workspaceId: string, dto: UpdateWorkspaceDto) {
    await this.ensureOwner(userId, workspaceId);
    const workspace = await this.workspacesRepository.update(workspaceId, dto);
    return WorkspaceResponseDto.from(workspace);
  }

  async inviteUser(ownerId: string, workspaceId: string, email: string) {
    await this.ensureOwner(ownerId, workspaceId);

    const userToInvite = await this.workspacesRepository.findUserByEmail(
      email.toLowerCase(),
    );
    if (!userToInvite)
      throw new NotFoundException('User with this email not found');

    try {
      const member = await this.workspacesRepository.createMember(
        workspaceId,
        userToInvite.id,
      );
      return WorkspaceMemberInviteResponseDto.from(member);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User is already a workspace member');
      }
      throw error;
    }
  }

  async removeMember(ownerId: string, workspaceId: string, memberId: string) {
    await this.ensureOwner(ownerId, workspaceId);
    if (memberId === ownerId)
      throw new ForbiddenException('The workspace owner cannot be removed');
    const member = await this.workspacesRepository.findMember(
      workspaceId,
      memberId,
    );
    if (!member) throw new NotFoundException('Workspace member not found');
    await this.workspacesRepository.deleteMember(member.id);
  }

  async remove(userId: string, workspaceId: string) {
    await this.ensureOwner(userId, workspaceId);
    await this.workspacesRepository.delete(workspaceId);
  }

  private async ensureMembership(userId: string, workspaceId: string) {
    const membership = await this.workspacesRepository.findMember(
      workspaceId,
      userId,
    );
    if (!membership)
      throw new ForbiddenException('You do not have access to this workspace');
    return membership;
  }

  private async ensureOwner(userId: string, workspaceId: string) {
    const workspace = await this.workspacesRepository.findById(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    if (workspace.ownerId !== userId)
      throw new ForbiddenException(
        'Only the workspace owner can perform this action',
      );
    return workspace;
  }
}
