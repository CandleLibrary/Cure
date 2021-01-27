import { JSNode } from "@candlefw/js";

import { ExpressionHandler } from "../../types/expression_handler.js";

const BindingCompilers = [];

export function loadBindingCompiler(obj: ExpressionHandler) {
    // Check for the presence of the expected 
    // properties of BindingExpressionCompiler
    if (!obj)
        return false;

    if (!obj.signature || typeof obj.signature !== "number")
        return false;

    if (!obj.test || typeof obj.test !== "function")
        return false;

    if (!obj.getExceptionMessage || typeof obj.test !== "function")
        return false;

    if (!obj.build || typeof obj.build !== "function")
        return false;

    BindingCompilers.push(obj);

    return true;
};

export function* selectBindingCompiler(node: JSNode): Generator<ExpressionHandler> {

    const type = node.type;

    for (const c of BindingCompilers) {
        if (((c.signature & (type & 0x7FFFFF))) && ((!(c.signature & 0xFF100000)) || c.signature == type)) {
            yield c;
        }
    }
};

export function clearBindingsCompilers() {
    BindingCompilers.length = 0;
}

export function test() {
    throw new SyntaxError("This is the error that was thrown");
}