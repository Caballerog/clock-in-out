import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from 'modules/auth/auth.module';
import { UsersModule } from 'modules/users/users.module';
import { AppService } from 'app.service';
@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}