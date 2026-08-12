import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Get('workspace/:workspaceId')
  findAll(
    @CurrentUser() user: { id: string },
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.projectsService.findAllByWorkspace(user.id, workspaceId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { id: string }, @Param('id') projectId: string) {
    return this.projectsService.findOne(user.id, projectId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { id: string },
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(user.id, projectId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: { id: string }, @Param('id') projectId: string) {
    return this.projectsService.remove(user.id, projectId);
  }
}
