import { getTestSuite } from "../_internals/mod.ts";
import type { TestHook, TTestCtor } from "../types.ts";

export const AfterEach = (hook: TestHook) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    runner.addWrappedTestHook("after", hook);
  };
};
