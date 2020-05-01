import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

type CardinalPosition = /* 'top' | 'bottom' |  */ 'left' | 'right';

export interface UserPreferencesState {
  navAlign: CardinalPosition;
  accountsNavAlign: CardinalPosition;
  availableDevices: Device[];
  selectedDevice: Device;
}

export function createInitialState(): UserPreferencesState {
  return {
    navAlign: 'left',
    accountsNavAlign: 'right',
    availableDevices,
    selectedDevice: undefined,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-preferences' })
export class UserPreferencesStore extends Store<UserPreferencesState> {
  constructor() {
    super(createInitialState());
    this.update({ availableDevices });
  }

  setNavAlign(navAlign: CardinalPosition) {
    this.update({ navAlign });
  }

  setAccountsNavAlign(accountsNavAlign: CardinalPosition) {
    this.update({ accountsNavAlign });
  }

  updateDevice(selectedDevice: Device) {
    this.update({ selectedDevice });
  }

  /**
   * Same as updateDevice, but retrieves the device from the given device name
   */
  updateDeviceFromName(deviceName: string) {
    const device = this.getValue().availableDevices.find(
      (d) => d.device === deviceName,
    );
    this.updateDevice(device);
  }
}

interface Device {
  device: string;
  agent: string;
  platform?: string;
}

const availableDevices: Device[] = [
  {
    device: 'Samsung Galaxy S9',
    agent:
      'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
  },
  {
    device: 'Samsung Galaxy S8',
    agent:
      'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
  },
  {
    device: 'Samsung Galaxy S7',
    agent:
      'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
  },
  {
    device: 'Samsung Galaxy S7 Edge',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36',
  },
  {
    device: 'Samsung Galaxy S6',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
  },
  {
    device: 'Samsung Galaxy S6 Edge Plus',
    agent:
      'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
  },
  {
    device: 'Nexus 6P',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
  },
  {
    device: 'Sony Xperia XZ',
    agent:
      'Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36',
  },
  {
    device: 'Sony Xperia Z5',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
  },
  {
    device: 'HTC One X10',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0; HTC One X10 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.98 Mobile Safari/537.36',
  },
  {
    device: 'HTC One M9',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3',
  },
  {
    device: 'Apple iPhone XR (Safari)',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
  },
  {
    device: 'Apple iPhone XS (Chrome)',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1',
  },
  {
    device: 'Apple iPhone XS Max (Firefox)',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15',
  },
  {
    device: 'Apple iPhone X',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  },
  {
    device: 'Apple iPhone 8',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
  },
  {
    device: 'Apple iPhone 8 Plus',
    agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1',
  },
  {
    device: 'Apple iPhone 7',
    agent:
      'Mozilla/5.0 (iPhone9,3; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1',
  },
  {
    device: 'Apple iPhone 7 Plus',
    agent:
      'Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1',
  },
  {
    device: 'Apple iPhone 6',
    agent:
      'Mozilla/5.0 (Apple-iPhone7C2/1202.466; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3',
  },
  {
    device: 'Microsoft Lumia 650',
    agent:
      'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254',
  },
  {
    device: 'Microsoft Lumia 550',
    agent:
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; RM-1127_16056) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10536',
  },
  {
    device: 'Microsoft Lumia 950',
    agent:
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.1058',
  },
  {
    device: 'Google Pixel C',
    agent:
      'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
  },
  {
    device: 'Sony Xperia Z4 Tablet',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
  },
  {
    device: 'Nvidia Shield Tablet K1',
    agent:
      'Mozilla/5.0 (Linux; Android 6.0.1; SHIELD Tablet K1 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Safari/537.36',
  },
  {
    device: 'Samsung Galaxy Tab S3',
    agent:
      'Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36',
  },
  {
    device: 'Samsung Galaxy Tab A',
    agent:
      'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36',
  },
  {
    device: 'Amazon Kindle Fire HDX 7',
    agent:
      'Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36',
  },
  {
    device: 'LG G Pad 7.0',
    agent:
      'Mozilla/5.0 (Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Safari/537.36',
  },
  {
    device: 'One Plus 6',
    agent:
      'Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.111 Mobile Safari/537.36',
  },
];
