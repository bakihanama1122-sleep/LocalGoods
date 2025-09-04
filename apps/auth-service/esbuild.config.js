const { tsconfigPaths } = require('esbuild-plugin-tsconfig-paths');

module.exports = {
  plugins: [
    tsconfigPaths({
      tsconfig: 'tsconfig.base.json', // Point to your base tsconfig
    }),
  ],
};