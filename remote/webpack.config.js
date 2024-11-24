const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'angular',
  exposes: {
    './web-components': './src/bootstrap.ts',
  },
  shared: {},
});