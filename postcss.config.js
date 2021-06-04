module.exports = {
  plugins: [
    require("postcss-px-to-viewport")({
      viewportWidth: 750,
      exclude: [/node_modules/],
    }),
    require("postcss-px-to-viewport")({
      // viewportWidth: 750,
      viewportWidth: 375,
      include: [/node_modules/],
    }),
  ]
};
