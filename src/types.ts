/**
 * Contains the shared types for test-suite module in the particle11 core
 * library.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

/**
 * An interface describing an object passed to any hook representing the test
 * suite metadata.
 */
export interface IHookSuiteMeta {
  /**
   * The original name of the test.
   */
  name: string;
  /**
   * The display name of the test.
   */
  displayName: string;
  /**
   * The number of direct tests in the test suite.
   *
   * If using the class-decorator format, this will be derived from the class
   * name by default. In either format, if user defined, it will be the defined
   * display name.
   */
  testCount: number;
  /**
   * The number of directly nested test suites in the test suite.
   *
   * If using the class-decorator format, this will be the class name of the
   * test, otherwise it will be the user-defined display name.
   */
  suiteCount: number;
  /**
   * The total number of nested, including deeply nested, test suites in the
   * test suite.
   */
  totalSuiteCount: number;
  /**
   * The total number of tests, including those nested and deeply nested, in
   * the test suite.
   */
  totalTestCount: number;
}

/**
 * An interface describing an object passed to all but `TestSuite` hooks,
 * describing the current test metadata.
 */
export interface IHookTestMeta {
  /**
   * The complete test name, including the suite name and test case and
   * iteration meta, of the current test.
   */
  testName: string;
  /**
   * The original name of the test.
   *
   * If using the class-decorator format, this will be the method name of the
   * test, otherwise it will be the user-defined display name.
   */
  name: string;
  /**
   * The display name of the test.
   *
   * If using the class-decorator format, this will be derived from the method
   * name by default. In either format, if user defined, it will be the defined
   * display name.
   */
  displayName: string;
  /**
   * The number of test cases for the test.
   *
   * There is always at least one test case by default, even if not explicitly
   * defined. The default test cases is simply an empty array (`[]`).
   */
  testCaseCount: number;
  /**
   * The number of iterations to run per test case.
   *
   * There is always at least one test iteration per case by default, even if
   * not explictly defined. The default iteration is simply `1`.
   */
  iterationCount: number;
}

/**
 * An interface describing an object passed to `TestCase`, `TestIteration`, and
 * `TestFailure` hooks representing the current test case metadata.
 */
export interface IHookTestCaseMeta<T = unknown> {
  /**
   * The arguments list for the current test case.
   */
  args: T[];
  /**
   * The index of the current test case in regards to all test cases for the
   * current test.
   */
  index: number;
  /**
   * A utility flag indicating whether this is the first test of the test cases
   * for the current test.
   */
  first: boolean;
  /**
   * A utility flag indicating whether this is the last test of the test cases
   * for the current test.
   */
  last: boolean;
}

/**
 * An interface describing an object passed to `TestIteration` and
 * `TestFailure` hooks representing the current test case iteration metadata.
 */
export interface IHookTestIterationMeta {
  /**
   * The index of the current iteration in regards to the total iterations
   * of the current test case of the current test.
   */
  index: number;
  /**
   * A utility flag indicating whether this is the first iteration of the
   * current test case of the current test.
   */
  first: boolean;
  /**
   * A utility flag indicating whether this is the last iteration of the
   * current test case of the current test.
   */
  last: boolean;
}

/**
 * An interface describing an object passed to `TestSuite` hooks.
 */
export interface ISuiteHookMeta {
  /**
   * Metadata for the current test suite.
   */
  suite: IHookSuiteMeta;
}

/**
 * An interface describing an object passed to `Test` hooks.
 */
export interface ITestHookMeta extends ISuiteHookMeta {
  /**
   * Metadata for the current test.
   */
  test: IHookTestMeta;
}

/**
 * An interface describing an object passed to `TestCase` hooks.
 */
export interface ITestCaseHookMeta extends ITestHookMeta {
  /**
   * Metadata for the current test case.
   */
  testCase: IHookTestCaseMeta;
}

/**
 * An interface describing an object passed to `TestIteration` hooks.
 */
export interface ITestIterationHookMeta extends ITestCaseHookMeta {
  /**
   * Metadata for the current test iteration.
   */
  testIteration: IHookTestIterationMeta;
}

/**
 * An interface describing the collection of hooks for a `TestSuite`.
 */
export interface ISuiteHooksCollection {
  /**
   * The collection of hooks that run before and after, and upon a failure in,
   * a `TestSuite`.
   */
  suite?: {
    /**
     * The collection of hooks to run before a `TestSuite`.
     */
    start?: SuiteHook[];
    /**
     * The collection of hooks to run after a `TestSuite`.
     */
    end?: SuiteHook[];
    /**
     * The collection of hooks to run when a test fails within a `TestSuite`.
     *
     * These hooks are passed to the test and run before any hooks that are
     * defined on the test.
     */
    fail?: TestFailureHook[];
  };
  /**
   * The collection of hooks that run before and after, and upon a failure in,
   * a `Test`.
   *
   * These hooks are passed to the test and run before any hooks that are
   * defined on the test.
   */
  test?: {
    /**
     * The collection of hooks to run before a `Test`.
     */
    start?: TestHook[];
    /**
     * The collection of hooks to run after a `Test`.
     */
    end?: TestHook[];
    /**
     * The collection of hooks to run when a test fails within a `Test`.
     */
    fail?: TestFailureHook[];
  };
  /**
   * The collection of hooks that run before and after a `TestCase`.
   *
   * These hooks are passed to the test and run before any hooks that are
   * defined on the test.
   */
  testCase?: {
    /**
     * The collection of hooks to run before a `TestCase`.
     */
    start?: TestCaseHook[];
    /**
     * The collection of hooks to run after a `TestCase`.
     */
    end?: TestCaseHook[];
  };
  /**
   * The collection of hooks that run before and after a `TestIteration`.
   *
   * These hooks are passed to the test and run before any hooks that are
   * defined on the test.
   */
  testIteration?: {
    /**
     * The collection of hooks to run before a `TestIteration`.
     */
    start?: TestIterationHook[];
    /**
     * The collection of hooks to run after a `TestIteration`.
     */
    end?: TestIterationHook[];
  };
}

/**
 * A generic class constructor with an ID for tracking test suites.
 */
export interface TTestCtor<T = unknown> {
  /**
   * Instantiates a new class `T`.
   */
  new (...args: unknown[]): T;
  /**
   * The UUID for tracking test suites.
   */
  kitaiId?: string;
}

/**
 * An interface describing the options for a `TestSuite` or `Test`.
 */
export interface ITestOptions extends Omit<Deno.TestDefinition, "name" | "fn"> {
  /**
   * The hooks collection for the `TestSuite` or `Test`.
   */
  hooks?: ISuiteHooksCollection;
  [key: string]: unknown;
}

/**
 * An interface describing a plain anonymous object.
 */
export interface IAnonymousObject {
  toString(): string;
}

/**
 * The signature for a `TestSuite` hook.
 */
export type SuiteHook = (meta: ISuiteHookMeta) => void;
/**
 * The signature for a `Test` hook.
 */
export type TestHook = (meta: ITestHookMeta) => void;
/**
 * The signature for a `TestCase` hook.
 */
export type TestCaseHook = (meta: ITestCaseHookMeta) => void;
/**
 * The signature for a `TestIteration` hook.
 */
export type TestIterationHook = (meta: ITestIterationHookMeta) => void;
/**
 * The signature for a `TestFailure` hook.
 */
export type TestFailureHook = (
  error: Error,
  meta: ITestIterationHookMeta,
) => boolean;

export type TestMethod<T extends unknown[] = []> = (
  args: T,
  meta: ITestIterationHookMeta,
) => void;

export type TUnionIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void ? I
  : never;

export type ITestHooksCollection = Pick<
  ISuiteHooksCollection,
  "test" | "testCase" | "testIteration"
>;
