import { Injectable } from '@angular/core';
import { UserPreferencesStore } from 'src/app/core/user-preferences/user-preferences.store';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  get isCordova() {
    return !!window.cordova;
  }

  constructor(private preferencesStore: UserPreferencesStore) {
    // Bind the function to the window so that the iframe can access it through the js mocks
    (window as any).overrideUserAgent = this.overrideUserAgent.bind(this);
  }

  setOrientation(orientation: OrientationLockType) {
    window.screen.orientation.lock(orientation).catch((err) => {});
  }

  overrideUserAgent(targetWindow: Window = window) {
    if (this.isCordova) return;

    let device = this.preferencesStore.getValue().selectedDevice;
    const devices = this.preferencesStore.getValue().availableDevices;

    if (!device) {
      const randIndex = Math.trunc(Math.random() * devices.length);
      const randDevice = devices[randIndex];
      this.preferencesStore.updateDevice(randDevice);
      device = randDevice;
    }

    if (targetWindow.navigator) {
      const userAgent = device.agent;
      const platform = 'Linux armv8l';
      Object.defineProperty(targetWindow.navigator, 'userAgent', {
        get: () => userAgent,
      });
      Object.defineProperty(targetWindow.navigator, 'appVersion', {
        get: () => userAgent,
      });
      Object.defineProperty(targetWindow.navigator, 'platform', {
        get: () => platform,
      });
    }
  }
}
