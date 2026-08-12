import { Module } from '@nestjs/common';
import { WorkspacesRepository } from './repositories/workspaces.repository';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  providers: [WorkspacesService, WorkspacesRepository],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
