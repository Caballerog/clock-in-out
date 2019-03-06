import { User as UserEntity, User } from '../entities/user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../../common/config/database.tokens.constants';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import {
  SCHEDULE_EXCLUDE,
  SCHEDULE_HOURS,
  FIRST_HOUR_MORNING,
  FIRST_HOUR_NIGHT,
  LAST_HOUR_MORNING,
  LAST_HOUR_NIGHT,
  HOUR_FORMAT,
} from '../constants/users.constans';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public getUsersWithoutKey(): Promise<UserEntity[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .select('user.uid')
      .where('user.key IS NULL')
      .getMany();
  }
  public addUser(userDto: { uid: string; key: string }): Promise<User> {
    return this.usersRepository.save(Object.assign(new User(), userDto));
  }

  public getUsersMustBeWorkingNow() {
    const date = moment();
    const dayOfWeek = date.day() - 1;
    const hourNow = this.convertBetweenRealHourAndScheduleHour(date);
    const isMorning = this.isMorning(date);

    const users = this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.schedule', 'schedule')
      .leftJoinAndSelect(
        'user.auths',
        'auths',
        '(auths.timestamp > :lowerHour AND auths.timestamp < :upperHour)',
        {
          lowerHour: isMorning
            ? moment(FIRST_HOUR_MORNING, HOUR_FORMAT).unix()
            : moment(FIRST_HOUR_NIGHT, HOUR_FORMAT).unix(),
          upperHour: isMorning
            ? moment(LAST_HOUR_MORNING, HOUR_FORMAT).unix()
            : moment(LAST_HOUR_NIGHT, HOUR_FORMAT).unix(),
        },
      )
      .where('schedule.day = :dayOfWeek', {
        dayOfWeek,
      })
      .andWhere('schedule.hour = :hourNow', {
        hourNow,
      })
      .andWhere('schedule.room NOT IN (:...exclude)', {
        exclude: SCHEDULE_EXCLUDE,
      })
      .getMany();
    return users;
  }

  private convertBetweenRealHourAndScheduleHour(
    realHour: moment.Moment,
  ): number {
    return SCHEDULE_HOURS.findIndex(range =>
      realHour.isBetween(
        moment(range[0], HOUR_FORMAT),
        moment(range[1], HOUR_FORMAT),
        'milliseconds',
        '[]',
      ),
    );
  }

  private isMorning(hour: moment.Moment): boolean {
    return hour.isBetween(
      moment(FIRST_HOUR_MORNING, HOUR_FORMAT),
      moment(LAST_HOUR_MORNING, HOUR_FORMAT),
      'milliseconds',
      '[]',
    );
  }
}
