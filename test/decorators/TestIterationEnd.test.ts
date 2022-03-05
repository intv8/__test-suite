import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite, TestIterations, TestIterationEnd } = Testing.decorators;

const inc = {
  test: 0,
};

@TestSuite("TestIterationEnd")
class TestSuiteClass {

  @Test("iterations track correctly")
  @TestIterations(10)
  @TestIterationEnd(() => inc.test++)
  testIterations(_args:[], { testIteration }: ITestMeta) {
    assertEquals(testIteration.index, inc.test);
  }

  @Test("final check")
  testFinalCheck() {
    assertEquals(inc.test, 10)
  }
}

Testing(TestSuiteClass);
