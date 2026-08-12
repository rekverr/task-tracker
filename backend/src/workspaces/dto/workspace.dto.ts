import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'Marketing team' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

export class UpdateWorkspaceDto {
  @ApiProperty({ example: 'Marketing team — 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

export class InviteWorkspaceMemberDto {
  @ApiProperty({
    example: 'member@example.com',
    description: 'The user must already be registered.',
  })
  @IsEmail()
  email!: string;
}
