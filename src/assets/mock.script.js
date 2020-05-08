// Is replaced at runtime with the game installer

// The build version is directly set in the game script
window.buildVersion = '${window.buildVersion}';
window.appVersion = '${window.appVersion}';

// Override the user agent with the one from the parent window
window.parent.overrideUserAgent(window);

window.appInfo = {
  version: window.appVersion,
};

// Prevents script errors by mocking the dependencies
// window.indexedDB = {};
// window.IDBDatabase = {};
// window.IDBTransaction = {};
// window.IDBCursor = {};
// window.IDBKeyRange = {};
// window.openDatabase = null;

window.cordova = {
  plugins: {
    isemulator: {
      assess: function (fct) {
        fct(false);
      },
    },
    Keyboard: {
      close: function () {},
      disableScroll: function () {},
      show: function () {},
      hideKeyboardAccessoryBar: function () {},
    },
    notification: {
      local: false,
    },
    pushNotification: {
      onDeviceReady: function () {},
      setUserId: function () {},
      registerDevice: function () {},
    },
  },
};