import { assertEquals } from "../../dev_deps.ts";
import { Testing } from "../../mod.ts";
import { ExecutionOrderCases } from "./ExecutionOrder.cases.ts";

const {
  AfterEach,
  BeforeEach,
  TestSuite,
  TestStart,
  TestEnd,
  Test,
  TestCase,
  TestCaseEnd,
  TestCaseStart,
  TestIterationEnd,
  TestIterationStart,
  TestIterations,
} = Testing.decorators;

const sb: string[] = [];
const inc = { test: 0 };

@TestSuite("Testing execution order")
@BeforeEach(() => sb.push("BeforeEach"))
@AfterEach(() => sb.push("AfterEach"))
class TestSuiteClass {

  @Test("test TestSuiteStart & BeforeEach")
  testSuiteStartBeforeEach(){
    assertEquals(sb, ["BeforeEach"]);
  }

  @Test("test AfterEach")
  testAfterEach() {
    assertEquals(sb, ["BeforeEach", "AfterEach", "BeforeEach"]);
  }

  @Test("test TestStart & TestEnd")
  @TestStart(() => sb.push("TestStart"))
  @TestEnd(() => sb.push("TestEnd"))
  testTestStart() {
    assertEquals(sb, ["BeforeEach", "AfterEach", "BeforeEach", "AfterEach", "BeforeEach", "TestStart"]);
  }

  @Test("confirm TestEnd")
  @TestEnd(() => {
    while(sb.length) {
      sb.shift();
    }
  })
  testTestEnd() {
    assertEquals(sb, ["BeforeEach", "AfterEach", "BeforeEach", "AfterEach", "BeforeEach", "TestStart", "TestEnd", "AfterEach", "BeforeEach"]);    
  }

  @Test("cases & iterations")
  @TestCase([0], [1], [2])
  @TestIterations(5)
  @TestCaseStart(() => sb.push("TestCaseStart"))
  @TestCaseEnd(() => sb.push("TestCaseEnd"))
  @TestIterationStart(() => sb.push("TestIterationStart"))
  @TestIterationEnd(() => sb.push("TestIterationEnd"))
  testCasesInterations() {
    assertEquals(sb, ExecutionOrderCases[inc.test])
    inc.test++;
  }

  @Test("final check")
  testFinalCheck() {
    assertEquals(sb, ExecutionOrderCases[inc.test])
  }
}

Testing(TestSuiteClass);
