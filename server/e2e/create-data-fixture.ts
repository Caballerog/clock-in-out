import { DatabaseTest } from './database.test';
import { TestFixture } from './utils/fixtures/test.fixture';

(async () => {
  try {
    const db = new DatabaseTest(
      await DatabaseTest.createConnectionDB({ logging: 'all' }),
      {
        ...TestFixture,
      },
    );
    await db.reload();
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
  }
})();
