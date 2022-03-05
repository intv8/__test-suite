import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestIterations, TestIterationStart } = Testing.decorators;

const inc = {
  test1: 0,
  test2: 0,
};

@TestSuite("TestIterationStart")
class TestSuiteClass {

  @Test("iterations track correctly")
  @TestIterations(10)
  @TestIterationStart(() => inc.test1++)
  testIterations(_args:[], { testIteration }: ITestMeta) {
    assertEquals(testIteration.index + 1, inc.test1);
  }
}

Testing(TestSuiteClass);
