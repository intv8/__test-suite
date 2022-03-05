import { assertEquals } from "../../dev_deps.ts";
import { Testing } from "../../mod.ts";

const { Test, TestSuite, BeforeEach } = Testing.decorators;

const inc = {
  test: 0
};

@TestSuite("BeforeEach")
@BeforeEach(() => inc.test++)
class TestSuiteClass {

  @Test("runs before each test")
  testRunsBeforeTest() {
    assertEquals(inc.test, 1);
  }

  @Test("runs before next test")
  testRunsBeforeNextTest() {
    assertEquals(inc.test, 2);
  }
  
  @Test("final check")
  testFinalCheck() {
    assertEquals(inc.test, 3);
  }
}

Testing(TestSuiteClass);
