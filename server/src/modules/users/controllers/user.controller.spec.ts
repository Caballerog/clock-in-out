import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserService } from '../services/users.service';
import { UserController } from './user.controller';

describe('User Controller', () => {
  let testingModule: TestingModule;
  let controller: UserController;
  let spyService: UserService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            getUsersWithoutKey: jest.fn(() => true),
            addUser: jest.fn(() => true),
          }),
        },
      ],
    }).compile();
    controller = testingModule.get(UserController);
    spyService = testingModule.get(UserService);
  });
  describe('getUser', () => {
    it('should return users withoutKey', async () => {
      controller.getUsers();
      expect(spyService.getUsersWithoutKey).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should add key to the user', async () => {
      const params = {
        uid: 'uid',
        key: 'string',
      };
      controller.addUser(params);
      expect(spyService.addUser).toHaveBeenCalledWith(params);
    });
  });
});
