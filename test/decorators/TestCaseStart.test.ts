import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestCase, TestCaseStart } = Testing.decorators;

const inc = {
  test1: 0,
  test2: 0,
};

@TestSuite("TestCaseStart")
class TestSuiteClass {

  @Test("runs before each test")
  @TestCase([0, "hello"], [1, "world"], [2, "!"])
  @TestCaseStart(() => inc.test1++)
  testCaseData([count, msg]:[number, string], { test, testCase }: ITestMeta) {
    assertEquals(test.iterationCount, 1);
    assertEquals(test.testCaseCount, 3);
    assertEquals(count, testCase.index);
    assertEquals(inc.test1, testCase.index + 1);
    assertEquals(inc.test1, count + 1);
    assertEquals([count, msg], testCase.args);
    assertEquals(count === 0, testCase.first);
    assertEquals(count === 2, testCase.last);
  }
}

Testing(TestSuiteClass);
