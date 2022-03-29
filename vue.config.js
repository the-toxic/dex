module.exports = {

  // https://cli.vuejs.org/config/#transpiledependencies
  transpileDependencies: ["vuetify"],

  // disable generate .js.map files on build
  productionSourceMap: process.env.NODE_ENV !== 'production',

  // https://cli.vuejs.org/config/#css-extract
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: { additionalData: "@import '@/styles/_variables.scss'" },
      scss: { additionalData: "@import '@/styles/_variables.scss';" }
    },
  },

  chainWebpack: config => {
    // config.plugin('html').tap(args => {
    //   args[0].title = 'Dex App' // main page title
    //   args[0].minify = true
    //   return args
    // })

    // Remove the following lines to add Vue Prefetch and Preload on index.html
    // https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')

    // if(process.env.NODE_ENV === 'production') config.optimization.minimize(true)
  },

  runtimeCompiler: true // Need for work Vue.extend() in reports
}
