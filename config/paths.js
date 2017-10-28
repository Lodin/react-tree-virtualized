const path = require('path');

const resolve = relativePath => path.resolve(__dirname, '..', relativePath);

module.exports = {
  build: resolve('./dist/umd'),
  cache: resolve('./node_modules/.cache'),
  index: resolve('./src/index.ts'),
  modules: resolve('./node_modules'),
  specs: resolve('./specs'),
  src: resolve('./src'),
  stories: resolve('./stories'),
  tsconfig: resolve('./tsconfig.json'),
};
