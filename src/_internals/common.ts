//  Copyright 2021 IntegerEleven. All rights reserved. MIT license.

import { uuid } from "../../deps.ts";
import { TestRunner } from "../_internals/TestRunner.ts";
import type { Test } from "../_internals/Test.ts";
import type { TTestCtor } from "../types.ts";

const RUNNERS: { [key: string]: TestRunner } = {};

const config = {
  namingFunc: (runner: TestRunner, test: Test) => {
    const {
      displayName: runnerName,
    } = runner;

    const {
      displayName: testName,
      testCaseCount,
      testIterationCount,
    } = test;

    const runnerString = `${runnerName}`;
    const testString = `${testName} [${testCaseCount}:${testIterationCount}]`;

    return `${runnerString} - ${testString}`;
  },
};

export const getTestSuite = (
  target: TTestCtor,
): TestRunner => {
  if (!target.kitaiId) {
    target.kitaiId = uuid.generate();
  }

  const kid = target.kitaiId;
  const result = target.name.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  if (!RUNNERS[kid]) {
    RUNNERS[kid] = new TestRunner(finalResult.trim(), target);
  }

  return RUNNERS[kid];
};

export const setNamingFunc = (
  func: (runner: TestRunner, test: Test) => string,
) => {
  config.namingFunc = func;
};

export const getTestName = (
  runner: TestRunner,
  test: Test,
) => {
  return `${config.namingFunc(runner, test)}`;
};