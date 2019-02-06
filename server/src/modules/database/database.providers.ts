import { createConnection } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ENV } from 'env';

export const databaseProviders: Provider[] = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (env: ENV) => {
      return createConnection({
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
        logging: 'all',
      });
    },
    inject: [ENV],
  },
];
