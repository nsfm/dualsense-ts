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
    extensions: [".tsx", ".ts"],
    alias: {
      "node-hid$": path.resolve(__dirname, "util/node-hid.js"),
    },
  },
  optimization: {
    usedExports: true,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "dualsense-ts",
      filename: "index.html",
      path: path.resolve(__dirname, "dist"),
    }),
  ],
};
