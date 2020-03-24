import { TestError } from "../test_running/test_error.js";
import { ImportSource } from "./test_rig.js";

/**
 * Provides methods and properties that are used during test execution.
 */
export interface TestHarness {

    imports: ImportSource[];

    /**
     * Array of Error objects that were generated during the test run.
     */
    errors: TestError[];

    /**
     * A temporary variable that can be used to hold assertion site object data.
     */
    regA: any;

    /**
     * A temporary variable that can be used to hold assertion site object data.
     */
    regB: any;

    /**
     * A temporary variable that can be used to hold assertion site object data.
     */
    regC: any;

    /**
     * A temporary variable that can be used to hold assertion site object data.
     */
    regD: any;

    /**
     * Stores an exception caught within an assertion site.
     */
    caught_exception: Error | TestError;
    last_error: Error | TestError;

    /**
     * Converts a value into a reportable string.
     *
     * @param {any} value - Any value that should be turned into string
     * that can be used in a error message.
     */
    makeLiteral: (value: any) => string;

    /**
     * Test whether a function throws when called.
     *
     * @param {Function} fn - A function that will be called.
     * @returns {boolean} - `true` if the function threw an exception.
     */
    throws: (fn: Function) => boolean;

    /**
     * Tests the equality of two values.
     *
     * If the values are objects, then `equal` from `deep-equal` is
     * used to determine of the values are similar.
     *
     * The values harness.regA and harness.regB are set to the values of a and b, respectively.
     *
     * @param {any} a - A value of any type.
     * @param {any} b - A value of any type.
     *
     * @returns {boolean} - `true` if the two values are the same.
     */
    equal: (a: any, b: any) => boolean;

    /**
     * Tests the equality of two values.
     *
     * If the values are objects, then `equal` from `deep-equal` is
     * used to determine of the values are similar.
     *
     * The values harness.regA and harness.regB are set to the values of a and b, respectively.
     *
     * @param {any} a - A value of any type.
     * @param {any} b - A value of any type.
     *
     * @returns {boolean} - `true` if the two values are different.
     */
    notEqual: (a, b) => boolean;

    /**
     * Handles the assertion thrown from an external library.
     *
     * @param {Function} fn - A function that will be called.
     * @returns {boolean} - `true` if the function threw an exception.
     */
    externAssertion: (fn: Function) => boolean;

    /**
     * Add error to test harness.
     */
    setException: (e) => void;
}