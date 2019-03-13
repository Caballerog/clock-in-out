import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { UserService } from './modules/users/services/users.service';
import { AuthDto } from './modules/auth/dto/auth.dto';

describe('App service', () => {
  let testingModule: TestingModule;
  let service: AppService;
  let spyAuthService: AuthService;
  let spyUserService: UserService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: AuthService,
          useFactory: () => ({
            authIn: jest.fn(() => true),
            authOut: jest.fn(() => true),
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            getUsersMustBeWorkingNow: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = testingModule.get(AppService);
    spyAuthService = testingModule.get(AuthService);
    spyUserService = testingModule.get(UserService);
  });
  describe('authIn', () => {
    it('should invoke authIn from AuthService', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };

      await service.authIn(params);

      expect(spyAuthService.authIn).toHaveBeenCalledWith(params);
    });
  });
  describe('authOut', () => {
    it('should invoke authOut from AuthService', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };

      await service.authOut(params);

      expect(spyAuthService.authOut).toHaveBeenCalledWith(params);
    });
  });
  describe('usersTicketing', () => {
    it('should return an object cotaining the users must be working list and moment.unix', async () => {
      Date.now = jest.fn(() => {
        const d = new Date(Date.UTC(2017, 10, 10, 8, 25));
        const nd = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        return nd.valueOf();
      });

      const result = await service.usersTicketing();

      expect(spyUserService.getUsersMustBeWorkingNow).toHaveBeenCalled();
      expect(result).toEqual({
        users: true,
        timestamp: 1510298700,
      });
    });
  });
});
