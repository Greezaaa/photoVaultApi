const { register } = require('tsconfig-paths');
const { resolve } = require('path');

const baseUrl = resolve(__dirname, 'dist');
register({
  baseUrl,
  paths: require('./tsconfig.json').compilerOptions.paths,
});
