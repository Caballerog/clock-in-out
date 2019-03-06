import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthDto } from './modules/auth/dto/auth.dto';

describe('App Controller', () => {
  let testingModule: TestingModule;
  let controller: AppController;
  let spyService: AppService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useFactory: () => ({
            authIn: jest.fn(() => true),
            authOut: jest.fn(() => true),
            usersTicketing: jest.fn(() => true),
          }),
        },
      ],
    }).compile();
    controller = testingModule.get(AppController);
    spyService = testingModule.get(AppService);
  });
  describe('authIn', () => {
    it('should authIn an user', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };
      controller.authIn(params);
      expect(spyService.authIn).toHaveBeenCalledWith(params);
    });
  });

  describe('authOut', () => {
    it('should authOut an user', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };
      controller.authOut(params);
      expect(spyService.authOut).toHaveBeenCalledWith(params);
    });
  });

  describe('usersTicketing', () => {
    it("should return the user's list who clock-in", async () => {
      controller.usersTicketing();
      expect(spyService.usersTicketing).toHaveBeenCalled();
    });
  });
});
