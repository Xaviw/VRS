const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  parallel: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = process.env.VUE_APP_TITLE;
      return args;
    });
  },
  configureWebpack: {
    mode: process.env.NODE_ENV,
    module: {
      rules: [
        {
          test: /worker.js$/,
          use: {
            loader: "worker-loader",
            options: {
              inline: "no-fallback",
              filename: "geo.[contentHash].js",
            },
          },
        },
        // {
        //   test: /\.(png|jpe?g|gif|svg|webp)$/i,
        //   use: [
        //     {
        //       loader: "image-webpack-loader",
        //       options: {
        //         disable: !isProduction,
        //       },
        //     },
        //   ],
        // },
      ],
    },
    plugins: [new BundleAnalyzerPlugin({ analyzerPort: "8889" })],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest",
          },
        },
      },
    },
    resolve: {
      alias: {
        util: "@/utils",
        com: "@/components",
        views: "@/views",
        back: "@/views/manage",
        front: "@/views/client",
      },
    },
    devServer: {
      port: 8888,
      host: "0.0.0.0",
      open: true,
      proxy: {
        "/api": {
          target: process.env.VUE_APP_API_BASE_URL,
          pathRewrite: {
            "^/api": "",
          },
          changeOrigin: true,
        },
      },
    },
  },
};
