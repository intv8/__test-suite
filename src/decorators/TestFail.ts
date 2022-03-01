import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TTestCtor, TestFailureHook } from "../types.ts";

export const TestFail = (hook: TestFailureHook) => {
  return (
    target: TTestCtor | IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    const runner = getTestSuite(
      (target as IAnonymousObject).constructor as TTestCtor,
    );
    const test = runner.test(String(propertyKey));

    test.addTestFailHook(hook);
  };
};
