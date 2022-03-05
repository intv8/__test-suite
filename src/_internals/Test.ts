import type { TestRunner } from "./TestRunner.ts";
import type {
  ITestCaseHookMetaData,
  ITestIterationHookMetaData,
  ITestHookMetaData,
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

  protected mergeConfig(runner: TestRunner) {
    this.options = merge(runner.getOptions(), this.options);
  }

  public async execute(key: string, instance: unknown, runner: TestRunner) {
    this.mergeConfig(runner);

    const name = getTestName(runner, this);
    const suite = runner.getSuiteMeta();
    const test: ITestHookMetaData = {
      testName: name,
      displayName: this.displayName,
      iterationCount: this.testIterations,
      name: key,
      testCaseCount: this.testCases.length || 1,
    };
    const { options, testCases, testIterations } = this;
    const method =
      (instance as { [key: string]: (...args: unknown[]) => void })[key];

    await Deno.test({
      name: `${"\u0008".repeat(name.length + 10)}${name}`,
      ignore: options.ignore,
      only: options.only,
      sanitizeExit: options.sanitizeExit,
      sanitizeOps: options.sanitizeOps,
      sanitizeResources: options.sanitizeResources,
      fn: async () => {
        const { hooks } = options;
        const testCaseLength = testCases.length || 1;
        let earlyBreak = false;

        await hooks?.beforeEachTest?.forEach(async (hook) =>
          await hook({ suite, test })
        );
        await hooks?.testStart?.forEach(async (hook) => await hook({ suite, test }));

        for (let a = 0; a < testCaseLength; a++) {
          const args = testCases[a] || [];
          const testCase: ITestCaseHookMetaData = {
            args,
            index: a,
            first: a === 0,
            last: a === testCaseLength - 1,
          };

          await options.hooks?.testCaseStart?.forEach(async (hook) =>
            await hook({ suite, test, testCase })
          );

          for (let i = 0; i < testIterations; i++) {
            const testIteration: ITestIterationHookMetaData = {
              first: i === 0,
              last: i === testIterations - 1,
              index: i,
            };

            await hooks?.testIterationStart?.forEach(async (hook) =>
              await hook({ suite, test, testCase, testIteration })
            );

            try {
              await method(args, { suite, test, testCase, testIteration });
            } catch (err) {
              const trapError =
                await hooks?.testFail?.reduce((_prev, hook) =>
                  hook(err, { suite, test, testCase, testIteration }), false as (string | boolean)) ||
                false;
              const trappedBy = trapError
                ? typeof trapError === "string"
                  ? trapError
                  : "Failed, but trapped by a TestFail hook"
                : "";

              if (!trapError) {
                throw err;
              }

              earlyBreak = true;
              console.log(`\x1b[31m${trappedBy}`);
            }

            await hooks?.testIterationEnd?.forEach(async (hook) =>
              await hook({ suite, test, testCase, testIteration })
            );

            if (earlyBreak) break;
          }

          await hooks?.testCaseEnd?.forEach(async (hook) =>
            await hook({ suite, test, testCase })
          );

          if (earlyBreak) break;
        }
            
        await hooks?.testEnd?.forEach(async (hook) =>
          await hook({ suite, test })
        );
        await hooks?.afterEachTest?.forEach(async (hook) =>
          await hook({ suite, test })
        );    
      },
    });
  }
}
