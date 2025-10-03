const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join,resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve:{
      alias:{
        "@packages":resolve(__dirname,"../../packages"),
    },
    extensions:[".ts",".js"],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets",
         "./src/swagger-output.json" // add swagger file here
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/swagger-output.json', // path to your swagger file
          to: '.', // copies to the root of dist folder
        },
      ],
    }),
  ],
};
