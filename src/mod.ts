/**
 * Source-level exports.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { getTestSuite, setNamingFunc } from "./_internals/common.ts";

import type { ITestOptions, TTestCtor } from "./types.ts";
import _decorators from "./decorators/mod.ts";

export * from "./types.ts";
export const decorators = _decorators;

function TestRunner(testSuite: TTestCtor, options: ITestOptions = {}) {
  executeTest(testSuite, options);
}

const executeTest = (
  testSuite: TTestCtor,
  options: ITestOptions = {},
) => {
  const runner = getTestSuite(testSuite as TTestCtor);
  runner.execute(options);
};

TestRunner.decorators = decorators;
TestRunner.setTestNamingFunction = setNamingFunc;

export const Testing = TestRunner;
