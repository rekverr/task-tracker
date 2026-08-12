import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MembershipRepository } from '../common/repositories/membership.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const tasksRepository = {
    create: jest.fn(),
  };
  const membershipRepository = {
    findProjectWorkspace: jest.fn(),
    findMembership: jest.fn(),
  };
  const gateway = {
    emitTaskCreated: jest.fn(),
    emitTaskUpdated: jest.fn(),
    emitTaskDeleted: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: tasksRepository },
        { provide: MembershipRepository, useValue: membershipRepository },
        { provide: TasksGateway, useValue: gateway },
      ],
    }).compile();
    service = module.get(TasksService);
    membershipRepository.findProjectWorkspace.mockResolvedValue({
      id: 'project-id',
      workspaceId: 'workspace-id',
    });
    membershipRepository.findMembership.mockResolvedValue({
      userId: 'user-id',
      workspaceId: 'workspace-id',
    });
  });

  it('creates a task for a workspace member and emits a realtime event', async () => {
    const createdTask = {
      id: 'task-id',
      projectId: 'project-id',
      title: 'Write tests',
      description: null,
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: null,
      assignee: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: null,
    };
    tasksRepository.create.mockResolvedValue(createdTask);

    const result = await service.create('user-id', {
      title: 'Write tests',
      projectId: 'project-id',
    });

    expect(result).toMatchObject({
      id: 'task-id',
      title: 'Write tests',
      projectId: 'project-id',
    });
    expect(tasksRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'project-id',
        title: 'Write tests',
      }),
    );
    expect(gateway.emitTaskCreated).toHaveBeenCalledWith(
      'project-id',
      expect.objectContaining({ id: 'task-id', title: 'Write tests' }),
    );
  });

  it('rejects a task assignee who is not in the workspace', async () => {
    membershipRepository.findMembership
      .mockResolvedValueOnce({ userId: 'user-id', workspaceId: 'workspace-id' })
      .mockResolvedValueOnce(null);

    await expect(
      service.create('user-id', {
        title: 'Private task',
        projectId: 'project-id',
        assigneeId: 'outside-user-id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
