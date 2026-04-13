import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartsModule } from './parts/parts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, PartsModule],
})
export class AppModule {}
