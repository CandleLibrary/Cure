import { DependGraphNode } from "../types/depend_graph_node";
import { ImportName } from "./import_name";

export type ImportDependNode = DependGraphNode & {
    /**
     * An of ImportName
     */
    import_names: Array<ImportName>;
    /**
     * An empty set for compatibility with the DependGraphNode
     */
    exports: Set<void>;
    /**
     * The path / URL / module_name of the import.
     */
    module_source: string;
    /**
     * `true` if the module specifier is a relative pathname.
     */
    IS_RELATIVE: boolean;
};