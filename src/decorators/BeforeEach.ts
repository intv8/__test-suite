import { getTestSuite } from "../_internals/mod.ts";
import type { TestHook, TTestCtor } from "../types.ts";

export const BeforeEach = (hook: TestHook) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    runner.addWrappedTestHook("before", hook);
  };
};
