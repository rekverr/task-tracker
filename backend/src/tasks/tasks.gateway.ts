import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },})
export class TasksGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @MessageBody() projectId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(projectId);
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @MessageBody() projectId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(projectId);
  }
}