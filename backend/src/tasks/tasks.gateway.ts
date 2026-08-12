import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

type SocketUser = { id: string; email: string };

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    const handshake = client.handshake as {
      auth: { token?: unknown };
      headers: { authorization?: string };
    };
    const token =
      handshake.auth.token ||
      handshake.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (typeof token !== 'string') return client.disconnect();
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      (client.data as { user?: SocketUser }).user = {
        id: payload.sub,
        email: payload.email,
      } satisfies SocketUser;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinProject')
  async handleJoinProject(
    @MessageBody() projectId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!(await this.canAccessProject(client, projectId)))
      return { ok: false, error: 'Access denied' };
    await client.join(projectId);
    return { ok: true };
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @MessageBody() projectId: string,
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(projectId);
    return { ok: true };
  }

  emitTaskCreated(projectId: string, task: unknown) {
    this.server.to(projectId).emit('taskCreated', task);
  }

  emitTaskUpdated(projectId: string, task: unknown) {
    this.server.to(projectId).emit('taskUpdated', task);
  }

  emitTaskDeleted(projectId: string, taskId: string) {
    this.server.to(projectId).emit('taskDeleted', { id: taskId });
  }

  private async canAccessProject(client: Socket, projectId: string) {
    const user = (client.data as { user?: SocketUser }).user;
    if (!user || typeof projectId !== 'string') return false;
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });
    if (!project) return false;
    return Boolean(
      await this.prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId: user.id,
          },
        },
      }),
    );
  }
}
