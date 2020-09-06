/**[API]:testing
 * 
 * A Compile Statements function should build test rigs from a 
 * source file. Each test rig SHOULD represent all necessary 
 * statements required to correctly assesses the expression 
 * within the assertion site. Spurious statements MAY be 
 * included, but statements that have an  effect on the result 
 * of the assertion expression MUST be included. 
 * 
 * There should be a unique test rig for each assertion site,
 * EXCEPT in the event the assertion site is part of a sequence
 * of assertion calls that MUST be run in order. This determination
 * is left to the user.
 * 
 * Any import requirement of an assertion site expression or it's
 * proceeding statements must be present within the test rig 
 * ImportSources.
 */


import { compileRawTestRigs } from "@candlefw/test/build/library/compile/compile_statements_new.js";
import { InitializeReporterColors } from "@candlefw/test/build/library/utilities/create_test_frame.js";

import URL from "@candlefw/url";
import { parser } from "@candlefw/js";
import { BasicReporter } from "@candlefw/test";

const source = await(URL.resolveRelative("./data/standard_test_spec.js")).fetchText(),
    imports = [],
    tests = [],
    reporter = new BasicReporter;

InitializeReporterColors(reporter);

const rigs = compileRawTestRigs(parser(source).ast, reporter, imports);

//console.log(0, 1, rigs);
// compileStatementsNew expects a global object and  
assert(rigs.length == 11);

assert(rigs[0].rig.ast.nodes.length == 5);
assert(rigs[1].rig.ast.nodes.length == 6);
assert(rigs[2].rig.ast.nodes.length == 5);
assert(rigs[3].rig.ast.nodes.length == 6);
assert(rigs[4].rig.ast.nodes.length == 7);
assert(rigs[5].rig.ast.nodes.length == 7);
assert(rigs[6].rig.ast.nodes.length == 5);
assert(rigs[7].rig.ast.nodes.length == 5);
assert(rigs[8].rig.ast.nodes.length == 5);
assert(rigs[9].rig.ast.nodes.length == 5);
assert(rigs[10].rig.ast.nodes.length == 6);

assert(rigs[0].rig.name == "0 Basic built in assertion should pass");
assert(rigs[1].rig.name == "1 Basic built in assertion");
assert(rigs[2].rig.name == "2 Chai assert test 1 - Undeclared variable error");
assert(rigs[3].rig.name == "3 Chai assert test 2");
assert(rigs[4].rig.name == "4 Chai assert test 3");
assert(rigs[5].rig.name == "5 Chai assert test 4");
assert(rigs[6].rig.name == "6 Report undeterminable test");
assert(rigs[7].rig.name == "7 Basic failed inequality");
assert(rigs[8].rig.name == "8 Failed strict equality");
assert(rigs[9].rig.name == "9 Passing equality");
assert(rigs[10].rig.name == "10 The NullReport update method should return true");