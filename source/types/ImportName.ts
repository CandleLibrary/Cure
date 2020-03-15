/**
 * Named import reference.
 */
export type ImportName = {
    /**
     * The reference name of the import that is available within the script;
     */
    import_name: string;
    /**
     * The original name of the imported reference as exported from the module;
     */
    module_name: string;
};
