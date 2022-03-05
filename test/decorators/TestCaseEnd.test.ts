import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestCase, TestCaseEnd } = Testing.decorators;

const inc = {
  test: 0,
};

@TestSuite("TestCaseEnd")
class TestSuiteClass {

  @Test("runs after each case")
  @TestCase([0, "hello"], [1, "world"], [2, "!"])
  @TestCaseEnd(() => inc.test++)
  testCaseData([count, msg]:[number, string], { test, testCase }: ITestMeta) {
    assertEquals(test.iterationCount, 1);
    assertEquals(test.testCaseCount, 3);
    assertEquals(count, testCase.index);
    assertEquals(inc.test, testCase.index);
    assertEquals([count, msg], testCase.args);
    assertEquals(count === 0, testCase.first);
    assertEquals(count === 2, testCase.last);
  }
}

Testing(TestSuiteClass);
