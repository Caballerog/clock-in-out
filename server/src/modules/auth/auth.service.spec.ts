import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { AuthService } from './auth.service';
import {
  AUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../../common/config/database.tokens.constants';
import { AuthDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import {
  STATUS_CODE_RESPONSE,
  INPUT,
  OUTPUT,
} from './constants/auth.constants';

describe('Auth service', () => {
  let testingModule: TestingModule;
  let service: AuthService;
  let spyAuthRepository: any;
  let spyUserRepository: any;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AUTH_REPOSITORY_TOKEN,
          useFactory: () => ({
            findOne: jest.fn(() => true),
            save: jest.fn(() => true),
          }),
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: () => ({
            save: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = testingModule.get(AuthService);
    spyAuthRepository = testingModule.get(AUTH_REPOSITORY_TOKEN);
    spyUserRepository = testingModule.get(USER_REPOSITORY_TOKEN);
  });
  describe('authIn', () => {
    it('should save authentication and return greetings', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };
      const user: Partial<User> = {
        uid: '1',
        name: 'nameUser',
      };

      spyUserRepository.findOne = jest.fn(() => user);
      spyAuthRepository.save = jest.fn();
      const greeting = await service.authIn(params);
      expect(greeting).toEqual({
        status: STATUS_CODE_RESPONSE.OK,
        msg: `Entrada - ${user.name}`,
      });
      expect(spyUserRepository.findOne).toHaveBeenCalledWith({
        where: { key: params.key },
      });
      expect(spyAuthRepository.save).toHaveBeenCalledWith({
        ...params,
        reader: INPUT,
        user,
        timestamp: expect.any(Number),
      });
    });
    it('should return error when the user is not found', async () => {
      const params = {} as AuthDto;
      spyUserRepository.findOne = jest.fn(() => undefined);

      const error = await service.authIn(params);

      expect(spyAuthRepository.save).not.toHaveBeenCalled();
      expect(error).toEqual({
        status: STATUS_CODE_RESPONSE.KO,
        msg: 'Error en la entrada',
      });
    });
    it('should return error when unexpected error appears', async () => {
      const params = {} as AuthDto;
      spyUserRepository.findOne = jest.fn(() => ({} as User));
      spyAuthRepository.save = jest.fn(() => {
        throw new Error();
      });
      const error = await service.authIn(params);

      expect(error).toEqual({
        status: STATUS_CODE_RESPONSE.KO,
        msg: 'Error en la entrada',
      });
    });
  });

  describe('authOut', () => {
    it('should save authentication and return bye', async () => {
      const params: AuthDto = {
        key: 'key',
        reader: 'reader',
      };
      const user: Partial<User> = {
        uid: '1',
        name: 'nameUser',
      };

      spyUserRepository.findOne = jest.fn(() => user);
      spyAuthRepository.save = jest.fn();
      const greeting = await service.authOut(params);
      expect(greeting).toEqual({
        status: STATUS_CODE_RESPONSE.OK,
        msg: `Salida - ${user.name}`,
      });
      expect(spyUserRepository.findOne).toHaveBeenCalledWith({
        where: { key: params.key },
      });
      expect(spyAuthRepository.save).toHaveBeenCalledWith({
        ...params,
        reader: OUTPUT,
        user,
        timestamp: expect.any(Number),
      });
    });
    it('should return error when the user is not found', async () => {
      const params = {} as AuthDto;
      spyUserRepository.findOne = jest.fn(() => undefined);

      const error = await service.authOut(params);

      expect(spyAuthRepository.save).not.toHaveBeenCalled();
      expect(error).toEqual({
        status: STATUS_CODE_RESPONSE.KO,
        msg: 'Error en la salida',
      });
    });
    it('should return error when unexpected error appears', async () => {
      const params = {} as AuthDto;
      spyUserRepository.findOne = jest.fn(() => ({} as User));
      spyAuthRepository.save = jest.fn(() => {
        throw new Error();
      });
      const error = await service.authOut(params);

      expect(error).toEqual({
        status: STATUS_CODE_RESPONSE.KO,
        msg: 'Error en la salida',
      });
    });
  });
});
