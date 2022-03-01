import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TTestCtor, TestCaseHook } from "../types.ts";

export const TestCaseStart = (hook: TestCaseHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    if (typeof target === "function") {
      const runner = getTestSuite(target as TTestCtor);

      runner.addTestCaseHook("start", hook);
    } else {
      const runner = getTestSuite(target.constructor as TTestCtor);
      const test = runner.test(String(propertyKey));
      test.addTestCaseHook("start", hook);
    }
  };
};
