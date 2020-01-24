import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  constructor() {}

  setOrientation(orientation: OrientationLockType) {
    window.screen.orientation.lock(orientation).catch(err => {});
  }
}
