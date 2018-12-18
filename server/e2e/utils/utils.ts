import { TestingModule } from '@nestjs/testing/testing-module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common/interfaces';

export class UtilsTesting {
  public agent: request.SuperTest<request.Test>;
  private server: express.Express;
  private app: INestApplication;
  private isInit = false;

  public async startServer(testingModule: TestingModule) {
    if (this.isInit) {
      return;
    }
    this.server = express();
    this.server.use(bodyParser.json());

    this.app = await testingModule.createNestApplication(this.server);
    this.agent = await request(this.server);
    await this.app.init();
  }
}
