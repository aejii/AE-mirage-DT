// Is replaced at runtime with the game installer

// The build version is directly set in the game script
window.buildVersion = '${window.buildVersion}';
window.appVersion = '${window.appVersion}';

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

function findKey(propToFind, obj = window, maxDepth = 10) {
  let path = `[YOUR OBJ]`;
  let refs = [];
  let results = [];

  const canRecursive = (o, k, d) =>
    typeof o === 'object' &&
    !refs.includes(o) &&
    o !== window &&
    !['self', '_parent'].includes(k) &&
    d < maxDepth &&
    !(o instanceof Element);

  const recursive = (currObj, currPath, depth = 0) => {
    for (const key in currObj) {
      const newPath = `${currPath}.${key}`;
      const newObj = currObj[key];
      if (key === propToFind) {
        console.log('Found in', newPath);
        results.push(newPath);
      } else {
        if (typeof newObj === 'object' && canRecursive(newObj, key, depth)) {
          refs.push(newObj);
          recursive(newObj, newPath, depth + 1);
        }
        if (Array.isArray(newObj)) {
          newObj.forEach((o) => {
            if (
              typeof o === 'object' &&
              canRecursive(o, key, depth)
            ) {
              refs.push(o);
              recursive(o, newPath, depth + 1);
            }
          });
        }
      }
    }
  };

  console.log('Starting ...');
  recursive(obj, path);
  console.log('DONE !');

  return results;
}
