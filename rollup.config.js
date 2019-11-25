import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

export default [{
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/variate.js',
            format: 'cjs'
        },
        {
            file: 'dist/variate.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        typescript(),
        json(),
        resolve({
            // the fields to scan in a package.json to determine the entry point
            // if this list contains "browser", overrides specified in "pkg.browser"
            // will be used
            mainFields: ['module', 'main'], // Default: ['module', 'main']

            // If true, inspect resolved files to check that they are
            // ES2015 modules
            modulesOnly: true, // Default: false

            // Force resolving for these modules to root's node_modules that helps
            // to prevent bundling the same package multiple times if package is
            // imported from dependencies.
            dedupe: [ 'deepmerge', 'get-value', 'json-logic-js' ], // Default: []

            // Any additional options that should be passed through
            // to node-resolve
            customResolveOptions: {}
        })
    ]
}];
