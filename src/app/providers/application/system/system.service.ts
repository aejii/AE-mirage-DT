import { Injectable } from '@angular/core';
import { UserAgentQuery } from './user-agent.query';
import { UserAgentStore } from './user-agent.store';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  get isCordova() {
    return !!window.cordova;
  }

  currentDevice$ = this.userAgentQuery.selectActive();
  devices$ = this.userAgentQuery.selectAll();

  constructor(
    private userAgentStore: UserAgentStore,
    private userAgentQuery: UserAgentQuery,
  ) {
    // Bind the function to the window so that the iframe can access it through the js mocks
    (window as any).overrideUserAgent = this.overrideUserAgent.bind(this);

    this.currentDevice$.subscribe((device) =>
      this.overrideUserAgent(window, device),
    );
  }

  setPhoneOrientation(orientation: OrientationLockType) {
    window.screen.orientation.lock(orientation).catch((err) => {});
  }

  setCurrentDevice(device: string) {
    this.userAgentStore.setActive(device);
  }

  overrideUserAgent(
    targetWindow = window,
    device = this.userAgentQuery.getActive(),
  ) {
    if (this.isCordova) return;

    if (!device?.agent) {
      const devices = this.userAgentQuery.getAll();
      const randIndex = Math.floor(Math.random() * devices.length);
      const randDevice = devices[randIndex];
      // Sets the random once, only on first app launch. Otherwise => user asked for random UA
      if (!device) this.userAgentStore.setActive(randDevice.device);
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
