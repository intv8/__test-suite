import { getTestSuite } from "../_internals/mod.ts";
import type { IAnonymousObject, TTestCtor } from "../types.ts";

export const TestIterations = (count: number) => {
  return (
    target: IAnonymousObject,
    propertyKey?: string | symbol,
  ) => {
    const runner = getTestSuite(target.constructor as TTestCtor);
    const test = runner.test(String(propertyKey));
    test.setIteration(count);
  };
};
