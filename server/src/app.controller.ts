import { Get, Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from './modules/auth/dto/auth.dto';
import { AuthResponseDto } from './modules/auth/dto/auth.response.dto';
import { AppService } from './app.service';
import { User } from './modules/users/entities/user.entity';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('in')
  authIn(@Body() ticket: AuthDto): Promise<AuthResponseDto> {
    return this.appService.authIn(ticket);
  }

  @Post('out')
  authOut(@Body() ticket: AuthDto): Promise<AuthResponseDto> {
    return this.appService.authOut(ticket);
  }
  @Get('users')
  usersTicketing(): Promise<{ users: User[]; timestamp: number }> {
    return this.appService.usersTicketing();
  }
}
