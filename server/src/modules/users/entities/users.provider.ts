import { Connection } from 'typeorm';
import { User } from './user.entity';
import {
  DB_CONNECTION_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../../../common/config/database.tokens.constants';

export const UserProviders = [
  {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DB_CONNECTION_TOKEN],
  },
];
