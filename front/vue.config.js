module.exports = {
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({
        svgo: {
          plugins: [
            {
              cleanupAttrs: true,
            }, {
              removeDoctype: true,
            }, {
              removeXMLProcInst: true,
            }, {
              removeComments: true,
            }, {
              removeMetadata: true,
            }, {
              removeTitle: true,
            }, {
              removeDesc: true,
            }, {
              removeUselessDefs: true,
            }, {
              removeEditorsNSData: true,
            }, {
              removeEmptyAttrs: true,
            }, {
              removeHiddenElems: true,
            }, {
              removeEmptyText: true,
            }, {
              removeEmptyContainers: true,
            }, {
              removeViewBox: false,
            }, {
              cleanUpEnableBackground: true,
            }, {
              convertStyleToAttrs: true,
            }, {
              convertColors: true,
            }, {
              convertPathData: true,
            }, {
              convertTransform: true,
            }, {
              removeUnknownsAndDefaults: true,
            }, {
              removeNonInheritableGroupAttrs: true,
            }, {
              removeUselessStrokeAndFill: true,
            }, {
              removeUnusedNS: true,
            }, {
              cleanupIDs: true,
            }, {
              cleanupNumericValues: true,
            }, {
              moveElemsAttrsToGroup: true,
            }, {
              moveGroupAttrsToElems: true,
            }, {
              collapseGroups: true,
            }, {
              removeRasterImages: false,
            }, {
              mergePaths: true,
            }, {
              convertShapeToPath: true,
            }, {
              sortAttrs: true,
            }, {
              transformsWithOnePath: false,
            }, {
              removeDimensions: true,
            }
          ],
        },
      });
  }
};
