// Import the plugin you just installed
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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

  return config; // Return the modified config
};