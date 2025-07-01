import { before, after } from 'mocha';
import { createTestConnection, clearDB, closeDB } from './config/test.config.js';

before(async function () {
  await createTestConnection();
  await clearDB();
});

after(async function () {
  await closeDB();
});