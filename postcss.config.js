module.exports = {
  plugins: [
    require("postcss-px-to-viewport")({
      viewportWidth: 750,
    })
  ]
};
