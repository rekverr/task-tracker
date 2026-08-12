import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipRepository } from '../common/repositories/membership.repository';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectsRepository } from './repositories/projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async create(userId: string, dto: CreateProjectDto) {
    await this.ensureWorkspaceAccess(userId, dto.workspaceId);
    const project = await this.projectsRepository.create({
      name: dto.name,
      workspaceId: dto.workspaceId,
    });
    return ProjectResponseDto.from(project);
  }

  async findAllByWorkspace(userId: string, workspaceId: string) {
    await this.ensureWorkspaceAccess(userId, workspaceId);
    const projects = await this.projectsRepository.findByWorkspace(workspaceId);
    return projects.map((project) => ProjectResponseDto.from(project));
  }

  async findOne(userId: string, projectId: string) {
    const project = await this.getProject(projectId);
    await this.ensureWorkspaceAccess(userId, project.workspaceId);
    return ProjectResponseDto.from(project);
  }

  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.getProject(projectId);
    await this.ensureOwner(userId, project.workspaceId);
    const updated = await this.projectsRepository.update(projectId, dto);
    return ProjectResponseDto.from(updated);
  }

  async remove(userId: string, projectId: string) {
    const project = await this.getProject(projectId);
    await this.ensureOwner(userId, project.workspaceId);
    await this.projectsRepository.delete(projectId);
  }

  private async getProject(projectId: string) {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  private async ensureWorkspaceAccess(userId: string, workspaceId: string) {
    const membership = await this.membershipRepository.findMembership(
      workspaceId,
      userId,
    );
    if (!membership)
      throw new ForbiddenException('You do not have access to this workspace');
    return membership;
  }

  private async ensureOwner(userId: string, workspaceId: string) {
    const membership = await this.ensureWorkspaceAccess(userId, workspaceId);
    if (membership.role !== 'OWNER')
      throw new ForbiddenException(
        'Only the workspace owner can perform this action',
      );
  }
}
