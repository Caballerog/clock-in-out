import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  AUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../../common/config/database.tokens.constants';
import { AuthEntity } from './entities/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import {
  STATUS_CODE_RESPONSE,
  INPUT,
  OUTPUT,
} from './constants/auth.constants';
import * as moment from 'moment';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: Repository<AuthEntity>,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: Repository<User>,
  ) {}

  async authIn(auth: AuthDto): Promise<AuthResponseDto> {
    try {
      const user = await this.saveTicketing({ ...auth, reader: INPUT });
      return this.welcomeTeacher(user.name);
    } catch (e) {
      return { status: STATUS_CODE_RESPONSE.KO, msg: 'Error en la entrada' };
    }
  }
  async authOut(auth: AuthDto): Promise<AuthResponseDto> {
    try {
      const user = await this.saveTicketing({ ...auth, reader: OUTPUT });
      return this.byeTeacher(user.name);
    } catch (e) {
      return { status: STATUS_CODE_RESPONSE.KO, msg: 'Error en la salida' };
    }
  }
  private async saveTicketing(auth: AuthDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        key: auth.key,
      },
    });
    if (!user) {
      throw new Error();
    }
    await this.authRepository.save({
      ...auth,
      user,
      timestamp: moment().unix(),
    });
    return user;
  }

  private welcomeTeacher(nameTeacher) {
    return {
      status: STATUS_CODE_RESPONSE.OK,
      msg: `Entrada - ${nameTeacher}`,
    };
  }
  private byeTeacher(nameTeacher) {
    return {
      status: STATUS_CODE_RESPONSE.OK,
      msg: `Salida - ${nameTeacher}`,
    };
  }
}
