import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'The first version looks good. Please adjust the header spacing.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text!: string;

  @ApiProperty({ example: '5cdd8953-f434-4d37-839c-528e332e322a' })
  @IsUUID()
  @IsNotEmpty()
  taskId!: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    example: 'The first version looks good after the header spacing update.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text!: string;
}
