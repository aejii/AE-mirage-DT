import { interval } from 'rxjs';
import { filter, first, map, shareReplay } from 'rxjs/operators';

export const rxjsUtils = {
  waitForTruthiness$,
};

/**
 * Waits for the given callback to return a truthy value
 */
function waitForTruthiness$<T>(
  callback: () => T,
  listenOnce = false,
  checkInterval = 100,
) {
  const ret = interval(checkInterval).pipe(
    map(callback),
    filter((v) => !!v),
  );

  if (listenOnce) return ret.pipe(first());
  return ret.pipe(first(), shareReplay());
}
