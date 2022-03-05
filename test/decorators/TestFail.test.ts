import { assertEquals } from "../../dev_deps.ts";
import { Testing } from "../../mod.ts";

const { Test, TestSuite, TestFail } = Testing.decorators;

const inc = {
  test: 0,
};

@TestSuite("TestFail")
class TestSuiteClass {

  @Test("failure trapping")
  @TestFail(() => {
    inc.test++;
    return true;  //  trap error
  })
  testFail() {
    assertEquals(0, 1);
  }

  @Test("runs before next test")
  testValueIncremented() {
    assertEquals(inc.test, 1);
  }
}

Testing(TestSuiteClass);
