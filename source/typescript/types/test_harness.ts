import { SourceMap } from "@candlefw/conflagrate";
import { ImportSource } from "./imports.js";
/**
 * Closure environment for privileged methods that operate on internal properties
 * of TestHarness
 */
export interface TestHarnessEnvironment {

    /**
     * Initialize all stacks and variables to zero length or zero and 
     * assign source file and working directory stings
     * @param test_source_location 
     * @param test_working_directory 
     */
    harness_init(test_source_location?: string, test_working_directory?): void;

    /**
     * Convert a source map string into a SourceMap object and assign
     * to the harness source_map property. Should only be called when
     * there is an active TestInfo through harness~pushTestResult
     */
    harness_initSourceMapFromString(test_source_map_string: string);

    /**
     * Convert a source map string into a SourceMap object and assign
     * to the harness source_map property.
     */
    harness_initialSourceCodeString(test_source_code: string);

    /**
     * Remove any TestInfo object with an index greater than 0 from the clipboard,
     * and place them in the results array.
    */
    harness_flushClipboard(): void;

    /**
     * Returns an array of completed TestInfo objects
     */
    harness_getResults();

    /**
     * Replace console.log with an internal logger that pushes
     * messages to TestInfo~log array
     */
    harness_overrideLog(): void;

    /**
     * Restores console.log back to its original function
     */
    harness_restoreLog(): void;

    /**
     * Public TestHarness interface
     */
    harness: TestHarness;
}

/**
 * Provides methods and properties that are used during test execution.
 */
export interface TestHarness {
    /**
     * Absolute URL string of the source file of the active test
     */
    readonly source_location: string;

    /**
     * The root directory for source files. Files outside this location should
     * not be accessed for reporting
     */
    readonly working_directory: string;

    /**
     * Source file code of the active Test
     */
    readonly test_source_code: string;

    /**
    * String JSON
    */
    readonly test_source_map: SourceMap;

    /**
     * Stack storing user registered time points;
     */
    time_points: number[];

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

    /**
     * Creates a new TestResult object and pushes it to
     * the top of the test clipboard stack, which makes it the
     * active test frame. All data pertaining to a test
     * collected by this new object. 
     */
    pushTestResult: () => void;

    /**
     * Remove the top most TestResult from the test clipboard stack
     * and adds it to the completed TestResult array.
     */
    popTestResult: () => void;

    /**
     * Set the name of the test frame if it has not already been assigned
     */
    setResultName(name: string): void;
}

