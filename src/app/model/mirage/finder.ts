import { GameInstance } from '../classes/game-instance';

/* tslint:disable: forin */

export class MgFinder {
  private defaultSearchConfiguration: SearchConfiguration = {
    window: true,
    singleton: true,
    proto: true,
    value: false,
    depth: 2,
  };

  constructor(private instance: GameInstance) {
    this.instance.events.gameInit$.subscribe(
      () => (this.instance.window.mgFind = this.mirageFinder.bind(this)),
    );
  }

  getSingleton<T>(
    matcher: SearchMatcher,
    configuration: SearchConfiguration,
    isPrototype = false,
  ) {
    const findings = this.mirageFinder<any, T>(matcher, configuration);

    if (findings.length > 1)
      console.error(
        `[MIRAGE | Finder] More than one result found for matcher : `,
        matcher,
      );

    return findings.shift?.()?.[isPrototype ? 'value' : 'parent'];
  }

  mirageFinder<Value = any, Parent = any>(
    matcher: SearchMatcher,
    _configuration: SearchConfiguration = {},
  ): SearchResult<Value, Parent>[] {
    const unkwnownKeys = [];
    const keys = Object.keys(this.defaultSearchConfiguration);
    for (const key in _configuration) {
      if (!keys.includes(key)) unkwnownKeys.push(key);
    }

    if (unkwnownKeys.length)
      console.log(
        '[Mirage Finder] -',
        'Unkonwn configuration keys :',
        unkwnownKeys.join(', '),
        '\nValid keys are :',
        keys.join(', '),
      );

    const configuration = {
      ...this.defaultSearchConfiguration,
      ..._configuration,
    };

    const wTargets = configuration.window ? this.getWindowTargets() : [];
    const sTargets = configuration.singleton ? this.getSingletonsTargets() : [];

    const mustSearchOnValue = this.mustSearchOnValue(matcher, configuration);

    if (mustSearchOnValue === null)
      throw new Error(
        '[MIRAGE | Finder] matcher must be either a string, RegExp, or memory reference (with isValue = true)',
      );

    const windowRefs = [];
    const wResults = wTargets.map(([key, value]) =>
      this.deepSearch(
        value,
        matcher,
        { current: 0, max: configuration.depth },
        `window.${key}`,
        windowRefs,
        mustSearchOnValue,
      ),
    );
    const fnResults =
      configuration.proto && !configuration.value
        ? this.protoSearch(matcher)
        : [];

    const singletonsRef = [];
    const sResults = sTargets.map(([key, value]) =>
      this.deepSearch(
        value.exports,
        matcher,
        { current: 0, max: configuration.depth },
        `singletons(${key})`,
        singletonsRef,
        mustSearchOnValue,
      ),
    );

    return Array.prototype.concat.apply(
      [],
      [...wResults, ...sResults, ...fnResults],
    );
  }

  protoSearch(matcher: SearchMatcher): SearchResult[] {
    const protoSingletons = this.getProtosTargets();

    const results: SearchResult[] = [];

    protoSingletons.forEach(([id, value]) => {
      const exported = value?.exports;
      const proto = exported?.prototype;
      if (!proto) return null;
      for (const key in { ...proto, ...exported }) {
        if (this.keyMatches(matcher, key))
          results.push({
            key,
            path: `new singletons(${id})(${new Array(value.exports.length)
              .fill(0)
              .map((_, i) => `arg${i}`)
              .join(', ')})`,
            value: value.exports,
          });
      }
    });

    return results;
  }

  deepSearch(
    target: any,
    matcher: SearchMatcher,
    depths: { current: number; max: number },
    path: string,
    references: any[],
    searchOnValue = false,
  ): SearchResult[] {
    const results: SearchResult[] = [];

    if (
      !target ||
      !(target?.length ?? Object.keys(target).length) ||
      references.includes(target) ||
      depths.current > depths.max ||
      target instanceof (this.instance.window as any).Element ||
      typeof target !== 'object' ||
      target === window ||
      target === this.instance.window
    )
      return [];

    references.push(target);

    if (Array.isArray(target))
      target.forEach((nexTarget, index) =>
        results.push(
          ...this.deepSearch(
            nexTarget,
            matcher,
            { current: depths.current + 1, max: depths.max },
            `${path}[${index}]`,
            references,
            searchOnValue,
          ),
        ),
      );
    else
      for (const key in target) {
        if (['self', '_parent'].includes(key)) continue;

        const nextTarget = target[key];
        const nextPath = `${path}.${key}`;

        if (
          (!searchOnValue && this.keyMatches(matcher, key)) ||
          (searchOnValue && matcher === nextTarget)
        )
          results.push({
            key,
            path: nextPath,
            value: nextTarget,
            parent: target,
          });

        results.push(
          ...this.deepSearch(
            nextTarget,
            matcher,
            { current: depths.current + 1, max: depths.max },
            `${nextPath}`,
            references,
            searchOnValue,
          ),
        );
      }

    return results;
  }

  mustSearchOnValue(
    matcher: any,
    configuration: SearchConfiguration,
  ): boolean | null {
    if (configuration.value) return true;
    else if (typeof matcher === 'string') return false;
    else if (matcher instanceof RegExp) return false;
    else if (matcher instanceof (this.instance.window as any).HTMLElement)
      return true;
    else if (
      Array.isArray(matcher) &&
      matcher.every(
        (_matcher) =>
          typeof _matcher === 'string' || _matcher instanceof RegExp,
      )
    )
      return false;
    else return undefined;
  }

  /** Gets the Ankama payload added to a window object */
  private getWindowTargets(): [string, any][] {
    return Object.entries(this.instance.window || {})
      .filter(([key]) => !(key in window))
      .filter(([key]) => !['singletons', 'cordova'].includes(key))
      .filter(([, value]) => typeof value === 'object');
  }

  private getSingletonsTargets() {
    return Object.entries(this.instance.window?.singletons?.c || {}).filter(
      (entry) => typeof entry?.[1]?.exports !== 'function',
    );
  }

  private getProtosTargets() {
    return Object.entries(this.instance.window?.singletons?.c || {}).filter(
      (entry) => typeof entry?.[1]?.exports === 'function',
    );
  }

  private keyMatches(matcher: string | RegExp, valueToCheck: string): boolean {
    return (
      (!!valueToCheck?.match?.(matcher) ||
        valueToCheck
          ?.toLowerCase?.()
          ?.includes?.(matcher?.toString?.()?.toLowerCase?.())) ??
      false
    );
  }
}

interface SearchConfiguration {
  window?: boolean;
  singleton?: boolean;
  proto?: boolean;
  value?: boolean;
  depth?: number;
}

interface SearchResult<Value = any, Parent = any> {
  key: string;
  path: string;
  value: Value;
  parent?: Parent;
}

// tslint:disable-next-line: class-name
interface _SearchMatcher extends RegExp, HTMLElement {}

type SearchMatcher = _SearchMatcher | string;
