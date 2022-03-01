import { getTestSuite } from "../_internals/mod.ts";
import type { SuiteHook, TTestCtor } from "../types.ts";

export const TestSuiteEnd = (hook: SuiteHook) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    runner.addTestSuiteHook("end", hook);
  };
};
