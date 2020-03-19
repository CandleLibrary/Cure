import { MinTreeNodeClass, MinTreeNode, stmt, MinTreeNodeType } from "@candlefw/js";
import { traverse, bit_filter, make_replaceable, extract, replace } from "@candlefw/conflagrate";

import { selectBindingCompiler } from "./assertion_compiler_manager.js";
import { Reporter } from "../main.js";

/**
 * Compiles an Assertion Site. 
 * 
 * @param node - An expression node within the double parenthesize Assertion Site. 
 * @param reporter - A Reporter for color data.
 */
export function compileAssertionSite(node: MinTreeNode, reporter: Reporter)
    : { ast: MinTreeNode, optional_name: string; } {

    const
        expr = node.nodes[0].nodes[0].nodes[0];

    for (const binding_compiler of selectBindingCompiler(expr)) {
        if (binding_compiler.test(expr)) {

            const
                js_string = binding_compiler.build(expr),

                { highlight, message, match, column, line } = binding_compiler.getExceptionMessage(expr, reporter),

                error_data = [
                    `\`${message}\``,
                    line || expr.pos.line,
                    column || expr.pos.char,
                    `\`${match.replace(/"/g, "\"")}\``,
                    `\"${highlight.replace(/"/g, "\\\"")}\"`
                ];

            const
                thr =
                    message ?
                        stmt(`if(${js_string}) $harness.setException(new AssertionError(${error_data}));`)
                        : stmt(`if(${js_string});`),

                landing = { ast: null };

            for (const node of traverse(thr, "nodes")

                .then(extract(landing))

                .then(replace(node => (node.pos = expr.pos, node)))

                .then(bit_filter("type", MinTreeNodeClass.IDENTIFIER))

                .then(make_replaceable())) {

                if (node.value == "t")
                    node.replace(expr);
            }

            return { ast: landing.ast, optional_name: match };
        }
    }

    //create new script
    return { ast: null, optional_name: "unknown test" };
}
