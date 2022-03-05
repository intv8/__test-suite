import { assertEquals } from "../../dev_deps.ts";
import { Testing } from "../../mod.ts";

const { Test, TestSuite, AfterEach } = Testing.decorators;

const inc = {
  test: 0
};

@TestSuite("AfterEach")
@AfterEach(() => inc.test++)
class TestSuiteClass {

  @Test("runs after each test")
  testRunsAfterTest() {
    assertEquals(inc.test, 0);
  }

  @Test("runs after next test")
  testRunsAfterNextTest() {
    assertEquals(inc.test, 1);
  }
  
  @Test("final check")
  testFinalCheck() {
    assertEquals(inc.test, 2);
  }
}

Testing(TestSuiteClass);
