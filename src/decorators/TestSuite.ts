import { getTestSuite } from "../_internals/mod.ts";
import type { TTestCtor } from "../types.ts";

export const TestSuite = (name?: string) => {
  return (target: TTestCtor) => {
    const runner = getTestSuite(target);

    if (name) {
      runner.displayName = name;
    }
  };
};
