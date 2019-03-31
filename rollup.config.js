import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default [{
    input: 'src/index.js',
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
        babel(),
        json(),
    ]
}];
