/**[API]:testing
 * 
 * Should compile test_rigs as a group in 
 * SEQUENCE : { ... } labeled blocks;
 */

import { compileRawTestRigs } from "@candlefw/test/build/library/compile/compile_statements.js";
import { InitializeReporterColors } from "@candlefw/test/build/library/utilities/create_test_frame.js";

import URL from "@candlefw/url";

import { parser, renderWithFormatting } from "@candlefw/js";

import { BasicReporter } from "@candlefw/test";

const source = await(URL.resolveRelative("./data/sequence_test_spec.js")).fetchText(),
    imports = [],
    tests = [],
    reporter = new BasicReporter;

InitializeReporterColors(reporter);

const result = compileRawTestRigs(parser(source).ast, reporter, imports);

// compileStatementsNew expects a global object and  
assert(result.raw_rigs.length == 1);
assert(result.raw_rigs[0].test_maps.length == 11);
