import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { UserService } from 'modules/users/services/users.service';
import { AuthDto } from 'modules/auth/dto/auth.dto';
import * as moment from 'moment';
import { User } from 'modules/users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  public async authIn(ticket: AuthDto) {
    return await this.authService.authIn(ticket);
  }
  public async authOut(ticket: AuthDto) {
    return await this.authService.authOut(ticket);
  }
  public async usersTicketing(): Promise<{ users: User[]; timestamp: number }> {
    const usersMustBeWorking = await this.usersService.getUsersMustBeWorkingNow();
    return {
      users: usersMustBeWorking,
      timestamp: moment().unix(),
    };
  }
}
