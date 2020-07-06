import { DTWindow } from '../DT/window';

export const gameFinderUtils = {
  attachFinderToWindow,
};

/**
 * Attaches a key finder to the window.
 * The key finder is for scouting purposes only.
 * It offers the functions
 *   - `singletonFind` → finds singletons that own the given key
 *   - `keyFind` → deeply finds a key in a given object
 */
function attachFinderToWindow(window: DTWindow) {
  window['singletonFind'] = findKeyInSingletons.bind(window);
  window['keyFind'] = findKeyInObject.bind(window);
  window['globalFind'] = (
    key: string,
    windowDepth = 10,
    singletonDepth = 5,
  ) => {
    console.log('Scouting for ', key, '...');
    console.log(
      `(Window depth = ${windowDepth}, singletons depth = ${singletonDepth})`,
    );
    const results = [
      ...findKeyInObject.call(window, key, windowDepth),
      ...findKeyInSingletons.call(window, key, singletonDepth),
    ];
    console.table(results);
    console.log('Done !');
  };
}

function findKeyInSingletons(propToFind, maxDepth = 10) {
  const singletonsCollection = (this as any).singletons.c;
  const singletons = [];

  // tslint:disable-next-line: forin
  for (const id in singletonsCollection) {
    const value = singletonsCollection[id];
    if (typeof value.exports === 'object') {
      singletons.push({ singletonId: id, ...value });
    }
  }

  const results = singletons.map((singletonRef) => {
    const singleton = singletonRef.exports;
    return findKeyInObject(
      propToFind,
      maxDepth,
      singleton,
      `singletons(${singletonRef.singletonId})`,
    );
  });

  return Array.prototype.concat.call([], ...results);
}

function findKeyInObject(
  propToFind,
  maxDepth = 10,
  obj = this,
  path = obj === this ? 'window' : '[YOUR OBJECT]',
) {
  const refs = [];
  const results = [];

  const canRecursive = (o, k, d) =>
    typeof o === 'object' &&
    !refs.includes(o) &&
    o !== this &&
    !['self', '_parent'].includes(k) &&
    d < maxDepth &&
    !(o instanceof Element);

  const recursive = (currObj, currPath, depth = 0) => {
    // tslint:disable-next-line: forin
    for (const key in currObj) {
      const newObj = currObj[key];
      if (key === propToFind) {
        results.push(`${currPath}.${key}`);
      } else {
        if (typeof newObj === 'object' && canRecursive(newObj, key, depth)) {
          refs.push(newObj);
          recursive(newObj, `${currPath}.${key}`, depth + 1);
        }
        if (Array.isArray(newObj)) {
          newObj.forEach((o) => {
            if (typeof o === 'object' && canRecursive(o, key, depth)) {
              refs.push(o);
              recursive(o, `${currPath}[${key}]`, depth + 1);
            }
          });
        }
      }
    }
  };

  recursive(obj, path);

  return results;
}
