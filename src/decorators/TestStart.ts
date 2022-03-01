import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TestHook, TTestCtor } from "../types.ts";

export const TestStart = (hook: TestHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    if (typeof target === "function") {
      const runner = getTestSuite(target as TTestCtor);

      runner.addTestHook("start", hook);
    } else {
      const runner = getTestSuite(target.constructor as TTestCtor);
      const test = runner.test(String(propertyKey));
      test.addTestHook("start", hook);
    }
  };
};
