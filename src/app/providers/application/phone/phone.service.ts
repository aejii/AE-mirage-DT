import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  constructor() {
    if (!window.cordova) {
    } else {
      this.setOrientation('landscape');
    }
  }

  setOrientation(orientation: OrientationLockType) {
    window.screen.orientation.lock(orientation).catch((err) => {});
  }

  overrideUserAgent() {
    const userAgent =
      'Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.111 Mobile Safari/537.36';
    const platform = 'Linux armv8l';

    Object.defineProperty(navigator, 'userAgent', {
      get: () => userAgent,
    });
    Object.defineProperty(navigator, 'appVersion', {
      get: () => userAgent,
    });
    Object.defineProperty(navigator, 'platform', {
      get: () => platform,
    });
  }
}
