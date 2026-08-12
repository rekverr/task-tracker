import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDto } from '../../common/dto/user-public.dto';

export class CommentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty()
  taskId!: string;

  @ApiProperty()
  authorId!: string;

  @ApiProperty({ type: UserPublicDto })
  author!: UserPublicDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(comment: {
    id: string;
    text: string;
    taskId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; email: string };
  }): CommentResponseDto {
    return {
      id: comment.id,
      text: comment.text,
      taskId: comment.taskId,
      authorId: comment.authorId,
      updatedAt: comment.updatedAt,
      author: UserPublicDto.from(comment.author),
      createdAt: comment.createdAt,
    };
  }
}
