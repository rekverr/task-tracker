import { Global, Module } from '@nestjs/common';
import { MembershipRepository } from '../common/repositories/membership.repository';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, MembershipRepository],
  exports: [PrismaService, MembershipRepository],
})
export class PrismaModule {}
