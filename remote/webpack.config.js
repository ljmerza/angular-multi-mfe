const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');


module.exports = withModuleFederationPlugin({
  name: 'angular3',

  exposes: {
    './web-components': './src/bootstrap.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
