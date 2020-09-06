import { ext, JSNodeType } from "@candlefw/js";
import { traverse, make_skippable, filter } from "@candlefw/conflagrate";
import URL from "@candlefw/url";
import { MinTreeExtendedNode } from "@candlefw/js/build/types/types/mintree_extended_node";
import { ImportModule } from "../types/import_module";

export function compileImport(node: MinTreeExtendedNode, imports: ImportModule[]) {




    const module_specifier = node.nodes[1]?.nodes[0]?.value;

    if (!module_specifier) return;

    //  process.exit();

    let url = new URL(module_specifier);

    const obj = <ImportModule>{
        imports: new Set,
        exports: new Set,
        import_names: [],
        module_source: url.IS_RELATIVE ? url.path : module_specifier,
        IS_RELATIVE: url.IS_RELATIVE
    };

    for (const { node: id, meta } of traverse(node, "nodes")
        .filter("type",
            JSNodeType.Specifier,
            JSNodeType.IdentifierModule,
            JSNodeType.IdentifierDefault
        )
        .makeSkippable()
    ) {
        if (id.type == JSNodeType.Specifier) {
            const [original, transformed] = id.nodes;

            meta.skip();

            if (transformed)
                obj.import_names.push({ import_name: <string>transformed.value, module_name: <string>original.value, pos: original.pos });
            else
                obj.import_names.push({ import_name: <string>original.value, module_name: <string>original.value, pos: original.pos });
        }
        else if (id.type == JSNodeType.IdentifierDefault) {

            obj.import_names.push({ import_name: <string>id.value, module_name: "default", pos: id.pos });
        }
        else {

            obj.import_names.push({ import_name: <string>id.value, module_name: <string>id.value, pos: id.pos });
        }
    }

    obj.import_names.forEach(n => obj.exports.add(n.import_name));

    imports.push(obj);

}
