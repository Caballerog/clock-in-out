import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm/connection/Connection';
import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { DB_CONNECTION_TOKEN } from '../src/common/config/database.tokens.constants';
import * as cp from 'child_process';
import { promisify } from 'util';
import { AuthEntity } from '../src/modules/auth/entities/auth.entity';
import { UserSchedule } from '../src/modules/users/entities/user-schedule.entity';

interface Model {
  name: string;
  className: string;
  depends?: string[];
}

interface DataFixture {
  [key: string]: any[];
}

const localModels: { [modelName: string]: Model } = {
  User: {
    name: 'User',
    className: User,
    depends: [],
  },

  AuthEntity: {
    name: 'AuthEntity',
    className: AuthEntity,
    depends: ['User'],
  },
  UserSchedule: {
    name: 'UserSchedule',
    className: UserSchedule,
    depends: ['User'],
  },
} as any;

@Injectable()
export class DatabaseTest {
  private modelsCharged = [];

  constructor(
    @Inject(DB_CONNECTION_TOKEN) private readonly DBConnection: Connection,
    @Inject('DataFixture') private readonly dataFixture: DataFixture,
  ) {}

  public sync() {
    return this.DBConnection.synchronize(true);
  }

  public async reload() {
    await this.sync();
    await this.init();
  }

  public async init() {
    for (const model of Object.values(localModels)) {
      await this.loadModel(model);
    }
  }

  public static createConnectionDB(
    options?: Partial<ConnectionOptions>,
  ): Promise<Connection> {
    return createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5531,
      username: 'root',
      password: 'toor',
      database: 'clock',
      entities: [User, AuthEntity, UserSchedule],
      synchronize: true,
      ...options,
    } as ConnectionOptions);
  }

  private async createData(modelName: string, className: any): Promise<any> {
    if (!this.dataFixture[modelName]) {
      return;
    }

    const repository = await this.DBConnection.getRepository(
      this.DBConnection.entityMetadatas.find(
        entity => entity.name === modelName,
      ).target,
    );

    const elements = this.dataFixture[modelName].map(newElement =>
      Object.assign(new className(), newElement),
    );
    await repository.save(elements);
  }

  private async loadModel(model: Model) {
    if (this.modelsCharged.indexOf(model.name) !== -1) {
      return;
    }

    if (model.depends && model.depends.length !== 0) {
      for (const dependencyName of model.depends) {
        const modelDependency = localModels[dependencyName];
        await this.loadModel(modelDependency);
      }
    }

    this.modelsCharged.push(model.name);

    return await this.createData(model.name, model.className);
  }
}
