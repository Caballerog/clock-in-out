import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from './users.service';
import { User } from '../../users/entities/user.entity';
import { USER_REPOSITORY_TOKEN } from '../../../common/config/database.tokens.constants';
import * as moment from 'moment';
import {
  HOUR_FORMAT,
  FIRST_HOUR_MORNING,
  LAST_HOUR_MORNING,
  SCHEDULE_EXCLUDE,
  FIRST_HOUR_NIGHT,
  LAST_HOUR_NIGHT,
} from '../constants/users.constans';

describe('User service', () => {
  let testingModule: TestingModule;
  let service: UserService;
  let spyRepository: any;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: () => ({
            save: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = testingModule.get(UserService);
    spyRepository = testingModule.get(USER_REPOSITORY_TOKEN);
  });
  describe('addUser', () => {
    it('should save an user in the database', async () => {
      const params = {
        uid: 'uid',
        key: 'key',
      };

      spyRepository.save = jest.fn();
      await service.addUser(params);

      expect(spyRepository.save).toHaveBeenCalledWith(
        Object.assign(new User(), params),
      );
    });
  });

  describe('getUsersWithoutKey', () => {
    it('should return all users who have not key', async () => {
      const getMany = jest.fn();
      const where = jest.fn(() => ({ getMany }));
      const select = jest.fn(() => ({ where }));
      spyRepository.createQueryBuilder = jest.fn(() => ({ select }));

      await service.getUsersWithoutKey();
      expect(spyRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(select).toHaveBeenCalledWith('user.uid');
      expect(where).toHaveBeenCalledWith('user.key IS NULL');
    });
  });

  describe('getUsersMustBeWorkingNow', () => {
    it.each`
      year    | month | day   | hour  | minute | seconds | hourNowExpected | dayNowExpected
      ${2017} | ${1}  | ${2}  | ${10} | ${0}   | ${0}    | ${1}            | ${3}
      ${2017} | ${1}  | ${3}  | ${8}  | ${15}  | ${0}    | ${0}            | ${4}
      ${2017} | ${1}  | ${6}  | ${8}  | ${15}  | ${1}    | ${0}            | ${0}
      ${2017} | ${1}  | ${7}  | ${11} | ${15}  | ${1}    | ${-1}           | ${1}
      ${2017} | ${1}  | ${8}  | ${11} | ${45}  | ${1}    | ${3}            | ${2}
      ${2017} | ${1}  | ${9}  | ${13} | ${44}  | ${59}   | ${4}            | ${3}
      ${2017} | ${1}  | ${10} | ${14} | ${44}  | ${59}   | ${5}            | ${4}
      ${2017} | ${1}  | ${13} | ${15} | ${44}  | ${1}    | ${-1}           | ${0}
      ${2017} | ${1}  | ${14} | ${16} | ${0}   | ${1}    | ${6}            | ${1}
      ${2017} | ${1}  | ${15} | ${17} | ${0}   | ${1}    | ${7}            | ${2}
      ${2017} | ${1}  | ${16} | ${19} | ${59}  | ${59}   | ${9}            | ${3}
      ${2017} | ${1}  | ${17} | ${20} | ${9}   | ${59}   | ${-1}           | ${4}
      ${2017} | ${1}  | ${20} | ${20} | ${10}  | ${0}    | ${10}           | ${0}
      ${2017} | ${1}  | ${21} | ${22} | ${9}   | ${59}   | ${11}           | ${1}
      ${2017} | ${1}  | ${22} | ${22} | ${10}  | ${1}    | ${-1}           | ${2}
    `(
      'should return all users who must be working now',
      async ({
        year,
        month,
        day,
        hour,
        minute,
        seconds,
        hourNowExpected,
        dayNowExpected,
      }) => {
        const getMany = jest.fn();
        const andWhere2 = jest.fn(() => ({ getMany }));
        const andWhere1 = jest.fn(() => ({ andWhere: andWhere2 }));
        const where1 = jest.fn(() => ({ andWhere: andWhere1 }));
        const leftJoinAndSelect = jest.fn(() => ({ where: where1 }));
        const innerJoinAndSelect1 = jest.fn(() => ({ leftJoinAndSelect }));
        spyRepository.createQueryBuilder = jest.fn(() => ({
          innerJoinAndSelect: innerJoinAndSelect1,
        }));

        Date.now = jest.fn(() => {
          const d = new Date(Date.UTC(year, month, day, hour, minute, seconds));
          const nd = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
          return nd.valueOf();
        });
        const isMorning = hour < 15;

        await service.getUsersMustBeWorkingNow();

        expect(spyRepository.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(innerJoinAndSelect1).toHaveBeenCalledWith(
          'user.schedule',
          'schedule',
        );
        expect(leftJoinAndSelect).toHaveBeenCalledWith(
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
        );
        expect(where1).toHaveBeenCalledWith('schedule.day = :dayOfWeek', {
          dayOfWeek: dayNowExpected,
        });
        expect(andWhere1).toHaveBeenCalledWith('schedule.hour = :hourNow', {
          hourNow: hourNowExpected,
        });
        expect(andWhere2).toHaveBeenCalledWith(
          'schedule.room NOT IN (:...exclude)',
          {
            exclude: SCHEDULE_EXCLUDE,
          },
        );
      },
    );
  });
});
