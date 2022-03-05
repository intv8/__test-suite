import type {
  ISuiteHookMetaData,
  ITestOptions,
  SuiteHook,
  TestCaseHook,
  TestFailureHook,
  TestHook,
  TestIterationHook,
  TTestCtor,
} from "../types.ts";

import { Test } from "./Test.ts";
import { merge } from "./util.ts";
import { getTestSuite } from "./common.ts";

export class TestRunner {
  protected nestedTestSuites: { [key: string]: TTestCtor } = {};

  protected tests: { [key: string]: Test } = {};

  protected calcMeta?: ISuiteHookMetaData;

  constructor(
    public displayName: string,
    protected suiteTarget: TTestCtor,
    protected options: ITestOptions = {},
  ) {}

  protected getHooks() {
    const options = this.options;
    const hooks = options.hooks = options.hooks || {};

    return hooks;
  }

  public addWrappedTestHook(position: "before" | "after", hook: TestHook): number {
    const hooks = this.getHooks();
    const hookName = position === "before" ? "beforeEachTest" : "afterEachTest";
    const list = hooks[hookName] = hooks[hookName] || [];
    hooks[hookName] = [hook, ...list];

    return hooks[hookName]!.length;
  }

  public addTestHook(position: "start" | "end", hook: TestHook): number {
    const hooks = this.getHooks();
    const hookName = position === "start" ? "testStart" : "testEnd";
    const list = hooks[hookName] = hooks[hookName] || [];
    hooks[hookName] = [hook, ...list];

    return hooks[hookName]!.length;
  }

  public addTestFailHook(hook: TestFailureHook): number {
    const hooks = this.getHooks();
    const list = hooks.testFail = hooks.testFail || [];
    hooks.testFail = [hook, ...list];

    return hooks.testFail.length;
  }

  public addTestCaseHook(
    position: "start" | "end",
    hook: TestCaseHook,
  ): number {
    const hooks = this.getHooks();
    const hookName = position === "start" ? "testCaseStart" : "testCaseEnd";
    const list = hooks[hookName] = hooks[hookName] || [];
    hooks[hookName] = [hook, ...list];

    return hooks[hookName]!.length;
  }

  public addTestIterationHook(
    position: "start" | "end",
    hook: TestIterationHook,
  ): number {
    const hooks = this.getHooks();
    const hookName = position === "start" ? "testIterationStart" : "testIterationEnd";
    const list = hooks[hookName] = hooks[hookName] || [];
    hooks[hookName] = [hook, ...list];

    return hooks[hookName]!.length;
  }

  public test(key: string): Test {
    const result = key.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    if (!this.tests[key]) {
      this.tests[key] = new Test(finalResult);
    }

    return this.tests[key];
  }

  public addTestSuite(key: string, runner: TTestCtor) {
    this.nestedTestSuites[key] = runner;
  }

  protected mergeOptions(options: ITestOptions) {
    this.options = merge<ITestOptions[]>(options, this.options);
  }

  public getOptions(): ITestOptions {
    return this.options;
  }

  public getSuiteMeta(): ISuiteHookMetaData {
    if (this.calcMeta) return this.calcMeta;
    const { displayName, nestedTestSuites, tests } = this;
    const suiteKeys = Object.keys(nestedTestSuites);
    const testKeys = Object.keys(tests);
    const name = this.constructor.name;
    const suiteCount = suiteKeys.length;
    const testCount = testKeys.length;
    const totalSuiteCount = suiteKeys.reduce((prev, curr) => {
      const nestedTest = getTestSuite(nestedTestSuites[curr]);
      return prev + nestedTest.getSuiteMeta().suiteCount;
    }, suiteCount);
    const totalTestCount = suiteKeys.reduce((prev, curr) => {
      const nestedTest = getTestSuite(nestedTestSuites[curr]);
      return prev + nestedTest.getSuiteMeta().testCount;
    }, testCount);

    return this.calcMeta = {
      displayName,
      name,
      suiteCount,
      testCount,
      totalSuiteCount,
      totalTestCount,
    };
  }

  public async execute(options: ITestOptions = {}) {
    this.mergeOptions(options);
    const testNames = Object.keys(this.tests);
    const testSuites = Object.keys(this.nestedTestSuites);
    const instance = new this.suiteTarget();
 
    await testNames.forEach(async (testName) => {
      const test = this.tests[testName];
      await test.execute(testName, instance, this);
    });
    await testSuites.forEach(async (suiteName) => {
      const suite = this.nestedTestSuites[suiteName];
      const nestedTest = getTestSuite(suite);
      nestedTest.displayName = `${this.displayName}/${nestedTest.displayName}`;
      await nestedTest.execute(options);
    });
  }
}
