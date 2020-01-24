// Global variables that van be used in all environments
export const commonEnvironment = {
  dofusTouchProxy: 'https://proxyconnection.touch.dofus.com/',
  iTunesManifestUrl:
    'https://itunes.apple.com/lookup?id=1041406978&t=' + Date.now(),

  get scriptBuildRegex() {
    return new RegExp(/window.buildVersion="([0-9\.]*)"/g);
  },

  appVersionPlaceholder: '${window.appVersion}',
  buildVersionPlaceholder: '${window.buildVersion}',

  scriptFilename: 'build/script.js',
  styleFilename: 'build/styles-native.css',

  indexMockFile: 'index.html',
  scriptMockFile: 'mock.script.js',
  styleMockFile: 'custom-styles.css',

  manifestFilename: 'manifest.json',
  assetMapFilename: 'assetMap.json',

  cordovaErrors: {
    files: {
      notFound: 1,
      exists: 12,
    },
  },

  gameInactivityObjectName: 'mirageInactivity',
};
