import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TTestCtor, TestIterationHook } from "../types.ts";

export const TestIterationEnd = (hook: TestIterationHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    if (typeof target === "function") {
      const runner = getTestSuite(target as TTestCtor);

      runner.addTestIterationHook("end", hook);
    } else {
      const runner = getTestSuite(
        (target as IAnonymousObject).constructor as TTestCtor,
      );
      const test = runner.test(String(propertyKey));

      test.addTestIterationHook("end", hook);
    }
  };
};
