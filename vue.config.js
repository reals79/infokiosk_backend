module.exports = {
  outputDir: "../api/public/admin",
  publicPath: process.env.NODE_ENV === 'production'
    ? '/admin/'
    : '/',
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://infokiosk.test"
      },
      "/storage": {
        target: "http://infokiosk.test"
      },
      "/download": {
        target: "http://infokiosk.test"
      }
    }
  },
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
            args[0].title = "InfoKiosk Admin";
            return args;
        })
    }
};
