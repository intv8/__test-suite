import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TTestCtor, TestHook } from "../types.ts";

export const TestEnd = (hook: TestHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    if (typeof target === "function") {
      const runner = getTestSuite(target as TTestCtor);

      runner.addTestHook("end", hook);
    } else {
      const runner = getTestSuite(target.constructor as TTestCtor);
      const test = runner.test(String(propertyKey));
      test.addTestHook("end", hook);
    }
  };
};
