import { getTestSuite } from "../_internals/mod.ts";
import type { SuiteHook, TTestCtor } from "../types.ts";

export const TestSuiteStart = (hook: SuiteHook) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    runner.addTestSuiteHook("start", hook);
  };
};
