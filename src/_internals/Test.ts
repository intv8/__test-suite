import type { TestRunner } from "./TestRunner.ts";
import type {
  IHookTestCaseMeta,
  IHookTestIterationMeta,
  IHookTestMeta,
  ITestOptions,
  TestCaseHook,
  TestFailureHook,
  TestHook,
  TestIterationHook,
} from "../types.ts";
import { merge } from "./util.ts";
import { getTestName } from "./common.ts";

export class Test<T extends unknown[] = unknown[]> {
  protected testCases: T[] = [];

  protected testIterations = 1;

  constructor(
    public displayName: string,
    protected options: ITestOptions = {},
  ) {}

  protected getHooks() {
    const options = this.options;
    const hooks = options.hooks = options.hooks || {};

    return hooks;
  }

  public get testCaseCount(): number {
    return this.testCases.length || 1;
  }

  public get testIterationCount(): number {
    return this.testIterations;
  }

  public addTestCase(...args: T[]): number {
    this.testCases = [...args, ...this.testCases];

    return this.testCases.length;
  }

  public setIteration(count: number): number {
    this.testIterations = count > 0 ? Math.ceil(count) : 1;

    return this.testIterations;
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

  protected mergeConfig(runner: TestRunner) {
    this.options = merge(runner.getOptions(), this.options);
  }

  public execute(key: string, instance: unknown, runner: TestRunner) {
    this.mergeConfig(runner);

    const name = getTestName(runner, this);
    const suite = runner.getSuiteMeta();
    const test: IHookTestMeta = {
      testName: name,
      displayName: this.displayName,
      iterationCount: this.testIterations,
      name: key,
      testCaseCount: this.testCases.length || 1,
    };
    const { options, testCases, testIterations } = this;
    const method =
      (instance as { [key: string]: (...args: unknown[]) => void })[key];

    options.hooks?.test?.start?.forEach((hook) => hook({ suite, test }));

    Deno.test({
      name: `${"\u0008".repeat(name.length + 10)}${name}`,
      ignore: options.ignore,
      only: options.only,
      sanitizeExit: options.sanitizeExit,
      sanitizeOps: options.sanitizeOps,
      sanitizeResources: options.sanitizeResources,
      fn: async () => {
        const testCaseLength = testCases.length || 1;

        for (let a = 0; a < testCaseLength; a++) {
          const args = testCases[a] || [];
          const testCase: IHookTestCaseMeta = {
            args,
            index: a,
            first: a === 0,
            last: a === testCaseLength - 1,
          };

          options.hooks?.testCase?.start?.forEach((hook) =>
            hook({ suite, test, testCase })
          );

          for (let i = 0; i < testIterations; i++) {
            const testIteration: IHookTestIterationMeta = {
              first: i === 0,
              last: i === testIterations - 1,
              index: i,
            };

            options.hooks?.testIteration?.start?.forEach((hook) =>
              hook({ suite, test, testCase, testIteration })
            );

            try {
              await method(args, { suite, test, testCase, testIteration });
            } catch (err) {
              options.hooks?.test?.fail?.forEach((hook) =>
                hook(err, { suite, test, testCase, testIteration })
              );
              options.hooks?.suite?.fail?.forEach((hook) =>
                hook(err, { suite, test, testCase, testIteration })
              );

              throw err;
            }

            options.hooks?.testIteration?.end?.forEach((hook) =>
              hook({ suite, test, testCase, testIteration })
            );
          }

          options.hooks?.testCase?.end?.forEach((hook) =>
            hook({ suite, test, testCase })
          );
        }
      },
    });

    options.hooks?.test?.end?.forEach((hook) => hook({ suite, test }));
  }
}
