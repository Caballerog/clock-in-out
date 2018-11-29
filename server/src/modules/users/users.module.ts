import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './services/users.service';
import { UserProviders } from './entities/users.provider';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...UserProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
