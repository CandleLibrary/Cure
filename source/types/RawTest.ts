import { MinTreeNode } from "@candlefw/js";
import { Lexer } from "@candlefw/whind";
import { ImportDependNode } from "./ImportDependNode";
export type RawTest = {
    suite: string;
    name: string;
    ast: MinTreeNode;
    /**
     * Weak hashing of the test structure.
     */
    hash?: string;
    error?: Error;
    imports: ImportDependNode[];
    pos: Lexer;
};
