module.exports = {
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
      ],
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
