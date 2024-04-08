import { beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import { testTransaction } from "orchid-orm";
import { db } from "./db";

export const useTestDatabase = () => {
  beforeAll(async () => {
    await testTransaction.start(db);
  });

  beforeEach(async () => {
    await testTransaction.start(db);
  });

  afterEach(async () => {
    await testTransaction.rollback(db);
  });

  afterAll(async () => {
    await testTransaction.close(db);
  });
};
