import { TestError } from "../test_running/test_error.js";
import { ImportSource } from "./test_rig.js";

/**
 * Provides methods and properties that are used during test execution.
 */
export interface TestHarness {
    /**
     * Timestamp 
     */
    last_time: number;

    /**
     * Set of files that are allowed to be opened by cfw.test for 
     * inspection.
     */
    accessible_files: Set<string>;

    inspect_count: number;

    imports: ImportSource[];

    /**
     * File path of the source test file.
     */
    origin: string;

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
     * In a sequenced run of tests, gives the index of the last
     * encountered AssertionSite.
     */
    test_index: number;

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

    /**
     * Appends inspection error to the test errors array
     * for review
     * 
     * @param {any[]} vals - Spread of all arguments passed 
     * to the function.
     */
    inspect: (...vals: any[]) => void;

    /**
     * Throws an Error object whose message is the details of 
     * the arguments serialized into a color formatted string.
     * 
     * @param {any[]} vals - Spread of all arguments passed 
     * to the function.
     */
    inspectAndThrow: (...vals: any[]) => void;
}