const config = require('./webpack.common');
const paths = require('./paths');

module.exports = Object.assign({}, config, {
  output: Object.assign({}, config.output, {
    filename: 'poetez-ts-react-lib.js',
    path: paths.build,
  }),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.src,
        loader: 'ts-loader',
        options: {
          configFileName: paths.tsconfig,
          compilerOptions: {
            mapRoot: '../dist/umd',
            target: 'es3',
          },
        },
      },
    ],
  },
});
