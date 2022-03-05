import { assertEquals } from "../../dev_deps.ts";
import { Testing, ITestMeta } from "../../mod.ts";

const { Test, TestSuite } = Testing.decorators;

@TestSuite()
class TestSuiteClass {

  @Test("Example Test Name")
  testWithDisplayName(_args:[], { test }: ITestMeta) {
    assertEquals(test.displayName, "Example Test Name");
    assertEquals(test.name, "testWithDisplayName");
    assertEquals(test.testName, "Test Suite Class - Example Test Name [1:1]");
  }

  @Test()
  testDefaultDisplayName(_args:[], { test }: ITestMeta) {
    assertEquals(test.displayName, "Test Default Display Name");
    assertEquals(test.name, "testDefaultDisplayName");
    assertEquals(test.testName, "Test Suite Class - Test Default Display Name [1:1]");
  }
}

Testing(TestSuiteClass);
