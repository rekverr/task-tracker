import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipRepository } from '../common/repositories/membership.repository';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentsRepository } from './repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    await this.ensureTaskAccess(userId, dto.taskId);
    const comment = await this.commentsRepository.create({
      text: dto.text,
      taskId: dto.taskId,
      authorId: userId,
    });
    return CommentResponseDto.from(comment);
  }

  async findByTask(userId: string, taskId: string) {
    await this.ensureTaskAccess(userId, taskId);
    const comments = await this.commentsRepository.findByTask(taskId);
    return comments.map((comment) => CommentResponseDto.from(comment));
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.getComment(commentId);
    if (comment.authorId !== userId)
      throw new ForbiddenException('Only the comment author can edit it');
    const updated = await this.commentsRepository.update(commentId, dto.text);
    return CommentResponseDto.from(updated);
  }

  async remove(userId: string, commentId: string) {
    const comment = await this.getComment(commentId);
    if (comment.authorId !== userId)
      throw new ForbiddenException('Only the comment author can delete it');
    await this.commentsRepository.delete(commentId);
  }

  private async getComment(commentId: string) {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  private async ensureTaskAccess(userId: string, taskId: string) {
    const task = await this.membershipRepository.findTaskProjectAccess(taskId);
    if (!task) throw new NotFoundException('Task not found');
    const membership = await this.membershipRepository.findMembership(
      task.project.workspaceId,
      userId,
    );
    if (!membership)
      throw new ForbiddenException('You do not have access to this task');
  }
}
