import { ExpressionHandler, ExpressionHandlerBase } from "./expression_handler";
import { Test } from "./test";
import { TestInfo } from "./test_info";
import { TestRunner } from "./test_runner";
import { TestSuite } from "./test_suite";

/**
 * A *virtual* reference that can be passed to an assertion_site/assertion_group
 * that specifies specific actions to take with the tests generated by assertion
 * call. 
 * 
 * For example, the meta_flag ``solo`` can be passed to an assertion_site to 
 * prevent other tests from running:
 * ```
 * assert(solo, 2 == 9);    // Will run and fail
 * assert(2==2);            // Will not run
 * ```
 * The string value of a flag must match that of an {AssertionSiteReferenceName}.
 * Namely, it must be a valid JavaScript identifier name.
 */
export type MetaLabel = AssertionReferenceName;

/**
 * A string whose values is a valid JavaScript identifier name.
 * 
 * The string must match the ECMAScript specification for an identifier name:
 * 
 * [ECMAScript IdentifierName](https://262.ecma-international.org/11.0/#prod-IdentifierName)
 * 
 * The regex will match an identifier name provided the the
 * characters are within ASCII space:
 * ```typescript
 * /[\$_a-zA-Z][\$_\w]{0,}/i
 * ```
 * 
 * 
 */
export type AssertionReferenceName = string;

/**
 * Used to pass customization options to cfw.test
 */
export interface CFWTestConfiguration {

    //General Properties

    /**
     * Continue monitoring files for changes after the 
     * initial test run. Default value is `false`
     */
    WATCH?: boolean;

    /**
     * The amount of time a test script is allowed to take
     * before timing out. Value is in milliseconds. 
     * 
     * Defaults to `2000`. 
     * 
     * Can be overridden per assertion_site/assertion_group
     */
    default_timeout?: number | 2000;

    /**
     * The number of times a test can be retried before a `FAILED`
     * result is accept as the truth. 
     * 
     * Defaults to `0`
     */
    default_retries?: number | 0;

    /**
     * Paths to to search for spec files. 
     * 
     * Defaults to  ["./test/"]
     */
    include_paths?: string[] | ["./test/"];

    /**
     * A list of paths and/or regular expression objects
     * to filter out unwanted results from included file paths.
     */
    exclude_paths?: (RegExp | string)[];

    //Test Runners

    /**
     * The default Test Runner to use for tests that have 
     * not been specified to use a specific runner through
     * a `meta_flag`
     * 
     * Defaults to the builtin DesktopRunner.
     */
    default_test_runner?: TestRunner;

    /**
     * An Array of test runner selector tuples that may be selected through
     * meta_flags to run tests through the particular runner.
     * 
     * Defaults to 
     * ```typescript
     * [{meta_flag:"browser", runner:BrowserRunner}]
     * ```
     */
    test_runners?: { meta_label: MetaLabel, runner: TestRunner; }[];


    //Assertion Sites And Expression Handlers

    /**
     * An array of valid Javascript identifier name strings that can be used to 
     * to override the default reference name for an assertion_site call.
     * 
     * Multiple names can be defined for the an assertion_site call
     * 
     * Defaults to:
     * ```
     * ['assert']
     * ```
     * Example value:
     * ```
     * ["it", "it_should", "test", "expect"]
     * ```
     */
    assertion_site_reference_name: AssertionReferenceName[];

    /**
     * An array of valid Javascript identifier name strings that can be used to 
     * to override the default reference name for an assertion_group call.
     * 
     * Multiple names can be defined for the an assertion_group call
     * 
     * Defaults to:
     * ```
     * ['assert_group']
     * ```
     * Example value:
     * ```
     * ["group", "these_should", "these", "every"]
     * ```
     */
    assertion_group_reference_name: AssertionReferenceName[];

    /**
     * Define overrides for expression handler script operators
     */
    expression_handler_operator_overloads: ExpressionHandlerOperator[];

    //Test Reporting

    /**
     * A List of Expression to override/extend the built in set of 
     * Expression handlers. User provided ExpressionHandlers take 
     * precedent over built-in handlers that match a given expression.
     */
    expression_handlers: ExpressionHandlerBase[];

    /**
     * Define add on reporter handlers whose print function are called 
     * during reporting and are passed Test data from assertion_site/assertion_groups
     * that are labeled with the matching MetaLabel.
     */
    meta_label_reporter_handlers: MetaLabelReporterHandler[];
}



interface MetaLabelReporterHandler {

    /**
     * Meta label to assign the handler and use with 
     * assertion_sites/assertion_groups
     */
    label: MetaLabel;

    print: (info: TestInfo, test: Test, suite: TestSuite) => string[];
}

interface ExpressionHandlerOperator {

    /**
     * A string of symbols to define the operator. 
     * 
     * Must not contain any space, newline, or command characters.
     */
    symbol: string,

    /**
     * Operators with higher precedent will act on inputs
     * before operators with lower precedent
     */
    precedent: number;

    /**
     * A friendly name to call the operator function.
     */
    name: AssertionReferenceName;

    /**
     * A function that accepts one or two arguments. The number
     * of parameters defined in the function will determine 
     * if the operator is a Binary or Unary operator.
     * 
     */
    function: ExpressionHandlerOperatorFunction;
}

interface ExpressionHandlerOperatorFunction {
    /**
     * Binary Operator
     */
    (left: any, right: any): boolean;
    /**
     * Unary Operator
     */
    (A: any): boolean;
}