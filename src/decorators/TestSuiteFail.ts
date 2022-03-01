import { getTestSuite } from "../_internals/mod.ts";
import type { TestFailureHook, TTestCtor } from "../types.ts";

export const TestSuiteFail = (hook: TestFailureHook) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    runner.addTestFailHook(hook);
  };
};
