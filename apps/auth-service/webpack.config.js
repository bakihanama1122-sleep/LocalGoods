// Import the plugin you just installed
const { composePlugins, withNx } = require('@nx/webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 👇 THIS IS THE TEST 👇
console.log('\n\n✅✅✅ --- CUSTOM WEBPACK CONFIG FOR AUTH-SERVICE IS LOADING --- ✅✅✅\n\n');

module.exports = (config, context) => {
  // config is the default webpack configuration from Nx
  // Add the TsconfigPathsPlugin to the 'resolve' section
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.plugins) {
    config.resolve.plugins = [];
  }

  config.resolve.plugins.push(
    new TsconfigPathsPlugin({
      configFile: 'tsconfig.base.json' // Or the path to your root tsconfig
    })
  );

  // Initialize the main plugins array if it doesn't exist.
  if (!config.plugins) {
    config.plugins = [];
  }

  // Add the CopyWebpackPlugin to copy the swagger file.
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/swagger-output.json',
          to: '.', // Copies to the root of the output directory
        },
      ],
    })
  );


  return config; // Return the modified config
};