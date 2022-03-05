import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestIterations, TestCase } = Testing.decorators;

const inc = {
  test1: 0,
  test2: 0,
};

@TestSuite("TestIterations")
class TestSuiteClass {

  @Test("iterations data")
  @TestIterations(10)
  testIterationsData(_args:[], { test, testIteration }: ITestMeta) {
    assertEquals(test.testName, "TestIterations - iterations data [1:10]");
    assertEquals(test.iterationCount, 10);
    assertEquals(test.testCaseCount, 1);
    assertEquals(testIteration.index, inc.test1);
    assertEquals(testIteration.index === 0, testIteration.first);
    assertEquals(testIteration.index === 9, testIteration.last);

    inc.test1++
  }

  @Test("iterations with cases")
  @TestCase([0, "hello"], [1, "world"], [2, "!"])
  @TestIterations(5)
  testIterationsWithCases([count, msg]:[number, string], { test, testCase, testIteration }: ITestMeta) {
    assertEquals(test.testName, "TestIterations - iterations with cases [3:5]");
    assertEquals(test.iterationCount, 5);
    assertEquals(test.testCaseCount, 3);
    assertEquals(count, testCase.index);
    assertEquals([count, msg], testCase.args);
    assertEquals(count === 0, testCase.first);
    assertEquals(count === 2, testCase.last);
    assertEquals(testIteration.index === 0, testIteration.first);
    assertEquals(testIteration.index === 4, testIteration.last);
    assertEquals(inc.test2, (testIteration.index + testCase.index) + (!testCase.index ? 0 : 2 ** (testCase.index + 1)));

    inc.test2++;
  }
}

Testing(TestSuiteClass);
