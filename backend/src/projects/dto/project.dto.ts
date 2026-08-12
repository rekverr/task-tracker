import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website redesign' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: '1c9b0689-0b1c-4d25-9b3b-3e2cc307fd09' })
  @IsUUID()
  @IsNotEmpty()
  workspaceId!: string;
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'Website redesign — Q3' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
