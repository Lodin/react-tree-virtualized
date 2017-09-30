const paths = require('../paths');

const tsconfig = require(paths.tsconfig);

require('ts-node').register({
  compilerOptions: Object.assign({}, tsconfig.compilerOptions, {
    declaration: false,
    isolatedModules: true,
    module: 'commonjs',
    target: 'es2015',
  }),
});
