import equal from "deep-equal";
import { performance } from "perf_hooks";
import util from "util";

//Types
import { parentPort } from "worker_threads";
import { TestResult } from "../types/test_result.js";
import { TestRig } from "../types/test_rig.js";
import { rst } from "../utilities/colors.js";
import { TestError } from "./test_error.js";
import { harnessConstructor } from "./test_harness.js";
import { constructTestFunction } from "./construct_test_function.js";
import { fail, pass } from "../utilities/colors.js";

export const

    ImportedModules: Map<string, any> = new Map(),
    //@ts-ignore
    harness = harnessConstructor(equal, util, performance, rst, TestError, false);

export async function loadImport(source) {
    return await import(source);
}

export function createAddendum(sources: import("/home/anthony/work/active/apps/cfw.workspace/packages/test/source/typescript/types/test_rig").ImportSource[], test: TestRig) {
    return (sources.filter(s => s.module_specifier == "@candlefw/url").length > 0) ? `await URL.server(); URL.GLOBAL = new URL("${test.cwd}")` : "";
}


async function RunTest({ test }: { test: TestRig; }) {

    const result: TestResult = { start: performance.now(), end: 0, duration: 0, errors: [], test, TIMED_OUT: false, PASSED: true };

    try {
        await (await constructTestFunction(
            test,
            harness,
            ImportedModules,
            TestError,
            loadImport,
            createAddendum,
            pass,
            fail
        ))();
    } catch (e) {

        let error = null;

        if (e instanceof TestError) {

            error = e;
        }
        else {
            try {
                error = new TestError(e, harness.origin, test.pos.line, test.pos.column, "", "", test.map);
            } catch (ee) {
                error = new TestError(`Could not wrap error:\n ${e} \n` + (typeof ee == "object" ? (ee.stack || ee.message || ee) : ee), harness.origin);
            }
        }

        error.index = harness.test_index;
        result.errors = harness.errors;
        result.errors.push(error);
        result.end = performance.now();
        result.PASSED = false;
    }

    harness.last_error = null;
    result.start = performance.now();
    result.end = performance.now();
    result.errors = harness.errors;

    if (result.errors.length > 0)
        result.PASSED = false;

    result.duration = result.end - result.start;

    parentPort.postMessage(result);
}

parentPort.on("message", RunTest);