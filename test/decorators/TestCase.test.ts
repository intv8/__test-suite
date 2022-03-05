import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestCase } = Testing.decorators;

const inc = {
  test1: 0,
  test2: 0,
};

@TestSuite("TestCase")
class TestSuiteClass {

  @Test("case data")
  @TestCase([0, "hello"], [1, "world"], [2, "!"])
  testWithDisplayName([count, msg]:[number, string], { test, testCase }: ITestMeta) {
    assertEquals(test.displayName, "case data");
    assertEquals(test.name, "testWithDisplayName");
    assertEquals(test.testName, "TestCase - case data [3:1]");
    assertEquals(test.iterationCount, 1);
    assertEquals(test.testCaseCount, 3);
    assertEquals(count, testCase.index);
    assertEquals(inc.test1, testCase.index);
    assertEquals([count, msg], testCase.args);
    assertEquals(count === 0, testCase.first);
    assertEquals(count === 2, testCase.last);

    inc.test1++
  }

  @Test()
  @TestCase([0, "hello"], [1, "world"], [2, "!"])
  testDefaultDisplayNameCaseData([count, msg]:[number, string], { test, testCase }: ITestMeta) {
    assertEquals(test.displayName, "Test Default Display Name Case Data");
    assertEquals(test.name, "testDefaultDisplayNameCaseData");
    assertEquals(test.testName, "TestCase - Test Default Display Name Case Data [3:1]");
    assertEquals(test.iterationCount, 1);
    assertEquals(test.testCaseCount, 3);
    assertEquals(count, testCase.index);
    assertEquals(inc.test2, testCase.index);
    assertEquals([count, msg], testCase.args);
    assertEquals(count === 0, testCase.first);
    assertEquals(count === 2, testCase.last);

    inc.test2++
  }
}

Testing(TestSuiteClass);
