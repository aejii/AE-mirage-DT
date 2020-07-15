import { GameInstance } from '../classes/game-instance';
import { DTWindow } from '../DT/window';

export class MgFinder {
  constructor(private instance: GameInstance) {}

  findKeyInWindow(
    matcher: string | RegExp,
    maxDepth: number = 5,
    targetOverride: (window: DTWindow) => any,
  ) {
    let target = this.instance.window;
    target = targetOverride?.(target) ?? target;

    if (!target) return;

    const results = [];
    const alreadySeenRefs = [];

    if (target === this.instance.window) {
      const entries = this._getAnkamaPayload();

      results.push(
        ...Array.prototype.concat(
          [],
          ...entries.map(([key, value]) =>
            this._recursiveSearch(
              value,
              matcher,
              key,
              alreadySeenRefs,
              maxDepth,
              0,
            ),
          ),
        ),
      );
    } else {
      results.push(
        ...this._recursiveSearch(
          target,
          matcher,
          `[TARGET]`,
          alreadySeenRefs,
          maxDepth,
          0,
        ),
      );
    }

    return results;
  }

  findKeyInSingleton(matcher: string | RegExp, maxDepth: number = 5) {
    const singletons = Object.entries<any>(
      this.instance.window?.singletons?.c ?? {},
    )
      .map(([key, value]) => [key, value.exports])
      .filter(([key, value]) => this._isTargetWorthBrowsing(value, key));

    if (!singletons?.length) return;

    const results = Array.prototype.concat(
      [],
      ...singletons.map(([key, value]) =>
        this._recursiveSearch(
          value,
          matcher,
          `singletons(${key})`,
          [],
          maxDepth,
          0,
        ),
      ),
    );

    return results;
  }

  findSingletonForKey(matcher: string, maxDepth: number = 5) {
    const singletons = Object.entries<any>(
      this.instance.window?.singletons?.c ?? {},
    )
      .map(([key, value]) => [key, value.exports])
      .filter(([key, value]) => this._isTargetWorthBrowsing(value, key));

    if (!singletons?.length) return;

    const results = Array.prototype
      .concat(
        [],
        ...singletons.map(([key, value]) =>
          this._recursiveSearch(
            value,
            new RegExp(`^${matcher}$`),
            `singletons(${key})`,
            [],
            maxDepth,
            0,
          ).map(() => value),
        ),
      )
      .filter((v, i, a) => a.indexOf(v) === i);

    if (results.length > 1)
      console.error(`[MIRAGE] More than one singleton found !`);

    return results.pop();
  }

  /** Gets the Ankama payload added to a window object */
  private _getAnkamaPayload(target = this.instance.window): [string, any][] {
    if (!target) return;
    return Object.entries(target)
      .filter(([key]) => !(key in window))
      .filter(([key]) => key !== 'singletons')
      .filter(([key, value]) => this._isTargetWorthBrowsing(value, key, []));
  }

  /**
   * Checks if an object is worth browsing.
   * (For instance, an HTML Element, a function or an already seen reference aren't worth)
   */
  private _isTargetWorthBrowsing(
    target: any,
    key: string,
    alreadySeenRefs: any[] = [],
  ) {
    return (
      !!target &&
      (!!target.length || !!Object.keys(target)?.length) &&
      typeof target === 'object' &&
      !alreadySeenRefs.includes(target) &&
      !(target instanceof Element) &&
      !['self', '_parent'].includes(key) &&
      !['rootElement'].includes(key)
    );
  }

  /**
   * Checks if a matcher can be matched against a value
   * @param matcher the search criteria. Either a string or a RegExp.
   * @param valueToCheck The value to apply the matcher to
   */
  private _matches(matcher: string | RegExp, valueToCheck: string): boolean {
    return (
      (!!valueToCheck?.match?.(matcher) ||
        valueToCheck
          ?.toLowerCase?.()
          ?.includes?.(matcher?.toString?.()?.toLowerCase?.())) ??
      false
    );
  }

  /**
   * Recursively finds a matching key in the provided target and its children
   */
  private _recursiveSearch(
    target: any,
    matcher: string | RegExp,
    path: string,
    alreadySeenRefs: any[],
    maxDepth: number,
    currentDepth: number,
  ): string[] {
    const results = [];
    // tslint:disable-next-line: forin
    for (const key in target) {
      const value = target[key];
      const currentPath = `${path}.${key}`;

      if (this._matches(matcher, key)) results.push(currentPath);

      if (!this._isTargetWorthBrowsing(value, key, alreadySeenRefs)) continue;
      if (currentDepth >= maxDepth) continue;

      if (Array.isArray(value)) {
        value.forEach((subValue, index) =>
          results.push(
            ...this._recursiveSearch(
              subValue,
              matcher,
              `${path}[${index}]`,
              alreadySeenRefs,
              maxDepth,
              currentDepth + 1,
            ),
          ),
        );
      } else {
        results.push(
          ...this._recursiveSearch(
            value,
            matcher,
            currentPath,
            alreadySeenRefs,
            maxDepth,
            currentDepth + 1,
          ),
        );
      }
    }
    alreadySeenRefs.push(target);
    return results;
  }
}
