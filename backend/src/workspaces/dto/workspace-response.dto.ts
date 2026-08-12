import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceRole } from '@prisma/client';
import { UserPublicDto } from '../../common/dto/user-public.dto';

export class WorkspaceMemberResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: WorkspaceRole })
  role!: WorkspaceRole;

  @ApiProperty({ type: UserPublicDto })
  user!: UserPublicDto;
}

export class WorkspaceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  ownerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ type: UserPublicDto })
  owner?: UserPublicDto;

  @ApiPropertyOptional({ type: [WorkspaceMemberResponseDto] })
  members?: WorkspaceMemberResponseDto[];

  static from(workspace: {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    owner?: { id: string; email: string } | null;
    members?: Array<{
      id: string;
      userId: string;
      role: WorkspaceRole;
      user: { id: string; email: string };
    }>;
  }): WorkspaceResponseDto {
    return {
      id: workspace.id,
      name: workspace.name,
      ownerId: workspace.ownerId,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      ...(workspace.owner && { owner: UserPublicDto.from(workspace.owner) }),
      ...(workspace.members && {
        members: workspace.members.map((member) => ({
          id: member.id,
          userId: member.userId,
          role: member.role,
          user: UserPublicDto.from(member.user),
        })),
      }),
    };
  }
}

export class WorkspaceMemberInviteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: WorkspaceRole })
  role!: WorkspaceRole;

  @ApiProperty({ type: UserPublicDto })
  user!: UserPublicDto;

  static from(member: {
    id: string;
    userId: string;
    role: WorkspaceRole;
    user: { id: string; email: string };
  }): WorkspaceMemberInviteResponseDto {
    return {
      id: member.id,
      userId: member.userId,
      role: member.role,
      user: UserPublicDto.from(member.user),
    };
  }
}
