import { Module, Provider } from '@nestjs/common';
import { ENV } from 'env/env';

const environment = process.env.NODE_ENV || 'default';

const provider: Provider = {
  provide: ENV,
  useFactory: () => import(`../../env/${environment}`).then(({ env }) => env),
};

@Module({
  providers: [provider],
  exports: [provider],
})
export class EnvModule {}
