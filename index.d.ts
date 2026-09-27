/**
 * @typedef ResolveOptions
 * @property {string} [prefix]
 * @property {string|Array<string>} [cwd]
 * @property {boolean} [global]
 *
 * @typedef {ResolveOptions & {key?: string|false}} LoadOptions
 */
export type ResolveOptions = {
    prefix?: string;
    cwd?: string | Array<string>;
    global?: boolean;
};
export type LoadOptions = ResolveOptions & {
    key?: string | false;
};
/**
 *  Load the plugin found using `resolvePlugin`.
 *
 * @param {string} name The name to import.
 * @param {LoadOptions} [options]
 * @returns {Promise<unknown>}
 */
export declare function loadPlugin(name: string, options?: LoadOptions): Promise<unknown>;
/**
 * Find a plugin.
 *
 * See also:
 * *   https://docs.npmjs.com/files/folders#node-modules
 * *   https://github.com/sindresorhus/resolve-from
 *
 * Uses the standard node module loading strategy to find `$name` in each given
 * `cwd` (and optionally the global `node_modules` directory).
 *
 * If a prefix is given and `$name` is not a path, `$prefix-$name` is also
 * searched (preferring these over non-prefixed modules).
 *
 * @param {string} name
 * @param {ResolveOptions} [options]
 * @returns {Promise<string>}
 */
export declare function resolvePlugin(name: string, options?: ResolveOptions): Promise<string>;
