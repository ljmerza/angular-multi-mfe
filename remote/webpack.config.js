const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "angular"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angular",
      library: { type: "var", name: 'angular' },
      filename: "remoteEntry.js",
      exposes: {
        './web-components': './src/bootstrap.ts',
      }
    })
  ],
};
