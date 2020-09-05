
"CFW.test internal test";

import chai from "chai";
import { NullReporter } from "../build/library/main.js";

"0 Basic built in assertion should pass";
assert(2 + 2 == 4);

"1 Basic built in assertion";
var t = 0;
assert(t = 4);

"2 Chai assert test 1 - Undeclared variable error";
assert((assert.equal(a + 1, 2)));

const assert = chai.assert;

"3 Chai assert test 2";
assert((assert.strictEqual(a + 1, 0)));

const a = 2;

"4 Chai assert test 3";
assert((assert.strictEqual(a + 1, 2, "expected a+1 to equal 2")));

"5 Chai assert test 4";
assert((assert.equal(a, 2, "expected a+1 to equal 2")));

"6 Report undeterminable test";
assert(data);

"7 Basic failed inequality";
assert(1 < 1);

"8 Failed strict equality";
assert(1 === "1");

"9 Passing equality";
assert(1 == "1");

"10 The NullReport update method should return true";
const np = new NullReporter();
asset(await np.complete() == true);
