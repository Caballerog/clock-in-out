import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { AuthProviders } from './entities/auth.providers';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [AuthService, ...AuthProviders],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
