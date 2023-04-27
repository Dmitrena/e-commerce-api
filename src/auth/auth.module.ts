import { UserModule } from './../user/user.module';
import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}), UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AtStrategy, RtStrategy],
})
export class AuthModule {}
