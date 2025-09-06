import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Will make this module globally available means in any service no need to import it
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
