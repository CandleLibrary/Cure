import spark from "@candlefw/spark";

import { completedRun, updateRun, startRun } from "../reporting/report.js";

import { Globals } from "source/types/globals.js";

import { TestRig } from "source/types/test_rig.js";
import { TestSuite } from "source/types/test_suite";
import { TestResult } from "../types/test_result.js";
import { inspect } from "./test_harness.js";
import { TestMap } from "../types/test_map.js";


function TestRigFromTestMap(test_map: TestMap, test_rig: TestRig): TestRig {
    const { index, map, origin, source, suite_index, pos, RUN, SOLO, INSPECT, IS_ASYNC, import_arg_specifiers, import_module_sources, type, test_function_object_args } = test_rig;
    let o = Object.assign({ map, origin, source, suite_index, pos, RUN, SOLO, INSPECT, IS_ASYNC, import_arg_specifiers, import_module_sources, type, test_function_object_args }, test_map);
    o.index = index + o.index;
    return o;
}

function mapResults(rst: TestResult) {

    const test = rst.test;

    if (test.type == "SEQUENCE") {

        const results: TestResult[] =
            test.test_maps.map(tm => (<TestResult>{
                TIMED_OUT: rst.TIMED_OUT,
                PASSED: true,
                duration: rst.duration,
                start: rst.start,
                end: rst.end,
                test: TestRigFromTestMap(tm, test),
                errors: []
            }));

        for (const error of rst.errors) {

            const result = results[error.index];

            if (error.index >= 0 && result) {
                result.PASSED = false;
                result.errors.push(error);
            } else for (const result of results) {
                result.PASSED = false;
                result.errors.push(error);
            }
        }

        return results;
    }
    return rst;
}
export async function runTests(tests: TestRig[], suites: TestSuite[], globals: Globals, RELOAD_DEPENDS: boolean = false) {

    const update_timout = 5, { runner, reporter, outcome } = globals;

    let FAILED = false, t = update_timout, SOLO_RUN = false;

    try {

        const final_tests = tests
            .map(test => {
                if (test.SOLO || test.INSPECT)
                    SOLO_RUN = true;
                return test;
            })
            .filter(test => test.RUN && (!SOLO_RUN || test.INSPECT || test.SOLO));


        await startRun(final_tests.flatMap(test => {

            if (test.type == "SEQUENCE") {
                return test.test_maps.map(tm => TestRigFromTestMap(tm, test));
            } else
                return test;
        }
        ), suites, reporter);

        outcome.results.length = 0;

        for (const res of runner.run(final_tests, RELOAD_DEPENDS, globals)) {
            try {

                if (res) {

                    outcome.results.push(...(res).flatMap(mapResults));

                    if (t-- < 1) {
                        updateRun(outcome.results, suites, reporter);
                        t = update_timout;
                    }

                }
                await spark.sleep(0);
            } catch (e) {
                return globals.exit("Failed to load test frame", e);
            }
        }

        outcome.results = outcome.results.sort((a, b) => a.test.index < b.test.index ? -1 : 1);

        FAILED = await completedRun(outcome.results, suites, reporter);

    } catch (e) {
        FAILED = true;
        globals.exit("Unrecoverable error encountered in run_tests.ts", e);
    }

    outcome.FAILED = FAILED;

    return outcome;
}
