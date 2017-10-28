'use strict';
// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const paths = require('../config/paths');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      loader: require.resolve('ts-loader'),
      include: [paths.specs, paths.src, paths.stories]
    },
  );
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
