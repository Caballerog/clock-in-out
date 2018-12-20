import { XSLToJson } from '../import';

export const TestFixture = {
  User: [],
  AuthEntity: [],
  UserSchedule: [],
};

[TestFixture.UserSchedule, TestFixture.User] = XSLToJson();
