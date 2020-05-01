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

// function overrideUserAgent() {
//   const userAgent =
//     'Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.111 Mobile Safari/537.36';
//   const platform = 'Linux armv8l';

//   Object.defineProperty(navigator, 'userAgent', {
//     get: () => userAgent,
//   });
//   Object.defineProperty(navigator, 'appVersion', {
//     get: () => userAgent,
//   });
//   Object.defineProperty(navigator, 'platform', {
//     get: () => platform,
//   });
// }

// overrideUserAgent();

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
            if (typeof o === 'object' && canRecursive(o, key, depth)) {
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
