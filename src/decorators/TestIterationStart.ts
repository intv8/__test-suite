import { getTestSuite } from "../_internals/mod.ts";
import type { TestIterationHook, IAnonymousObject, TTestCtor } from "../types.ts";

export const TestIterationStart = (hook: TestIterationHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    if (typeof target === "function") {
      const runner = getTestSuite(target as TTestCtor);

      runner.addTestIterationHook("start", hook);
    } else {
      const runner = getTestSuite(target.constructor as TTestCtor);
      const test = runner.test(String(propertyKey));
      test.addTestIterationHook("start", hook);
    }
  };
};
