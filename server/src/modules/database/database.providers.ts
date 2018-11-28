import { createConnection } from 'typeorm';
export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5531,
        username: 'root',
        password: 'toor',
        database: 'clock',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
        logging: 'all',
      }),
  },
];