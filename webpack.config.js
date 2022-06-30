const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "node-hid$": path.resolve(__dirname, "util/node-hid.js"),
    },
  },
  optimization: {
    usedExports: true,
    runtimeChunk: "single",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "bundle"),
  },
  devServer: {
    static: "./bundle",
  },
  plugins: [
    new HtmlWebpackPlugin({ title: "dualsense-ts", scriptLoading: "module" }),
  ],
};
