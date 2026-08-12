import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [TasksService, TasksGateway, TasksRepository],
  controllers: [TasksController],
})
export class TasksModule {}
