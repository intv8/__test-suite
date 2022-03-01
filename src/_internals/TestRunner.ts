import type {
  IHookSuiteMeta,
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

  protected calcMeta?: IHookSuiteMeta;

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

  public addTestSuiteHook(position: "start" | "end", hook: SuiteHook): number {
    const hooks = this.getHooks();
    const suite = hooks.suite = hooks.suite || {};
    const list = suite[position] = suite[position] || [];
    suite[position] = [hook, ...list];

    return suite[position]!.length;
  }

  public addTestSuiteFailHook(hook: TestFailureHook): number {
    const hooks = this.getHooks();
    const suite = hooks.suite = hooks.suite || {};
    const list = suite.fail = suite.fail || [];
    suite.fail = [hook, ...list];

    return suite.fail.length;
  }

  public addTestHook(position: "start" | "end", hook: TestHook): number {
    const hooks = this.getHooks();
    const test = hooks.test = hooks.test || {};
    const list = test[position] = test[position] || [];
    test[position] = [hook, ...list];

    return test[position]!.length;
  }

  public addTestFailHook(hook: TestFailureHook): number {
    const hooks = this.getHooks();
    const test = hooks.test = hooks.test || {};
    const list = test.fail = test.fail || [];
    test.fail = [hook, ...list];

    return test.fail.length;
  }

  public addTestCaseHook(
    position: "start" | "end",
    hook: TestCaseHook,
  ): number {
    const hooks = this.getHooks();
    const testCase = hooks.testCase = hooks.testCase || {};
    const list = testCase[position] = testCase[position] || [];
    testCase[position] = [hook, ...list];

    return testCase[position]!.length;
  }

  public addTestIterationHook(
    position: "start" | "end",
    hook: TestIterationHook,
  ): number {
    const hooks = this.getHooks();
    const testIteration = hooks.testIteration = hooks.testIteration || {};
    const list = testIteration[position] = testIteration[position] || [];
    testIteration[position] = [hook, ...list];

    return testIteration[position]!.length;
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

  public getSuiteMeta(): IHookSuiteMeta {
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

  public execute(options: ITestOptions = {}) {
    this.mergeOptions(options);
    const testNames = Object.keys(this.tests);
    const testSuites = Object.keys(this.nestedTestSuites);
    const instance = new this.suiteTarget();

    const suite = this.getSuiteMeta();

    options?.hooks?.suite?.start?.forEach((hook) => hook({ suite }));

    testNames.forEach((testName) => {
      const test = this.tests[testName];
      test.execute(testName, instance, this);
    });

    testSuites.forEach((suiteName) => {
      const suite = this.nestedTestSuites[suiteName];
      const nestedTest = getTestSuite(suite);
      nestedTest.displayName = `${this.displayName}/${nestedTest.displayName}`;
      nestedTest.execute(options);
    });
    options?.hooks?.suite?.end?.forEach((hook) => hook({ suite }));
  }
}
