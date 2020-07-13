import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SystemService, UIService } from '@providers';
import { filter, first } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';
import { InstallationStore } from 'src/app/core/installation/installation.store';
import { InstallationQuery } from '../../core/installation/installation.query';

@Component({
  selector: 'mg-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  fsBusy$ = this.UI.canPlay$;

  deviceForm = new FormControl();

  devices$ = this.system.devices$;
  device$ = this.system.currentDevice$;

  get isCordova() {
    return this.system.isCordova;
  }

  isElk$ = this.installationQuery.select('isElk');

  constructor(
    private installationService: InstallationService,
    private installationQuery: InstallationQuery,
    private installationStore: InstallationStore,
    private system: SystemService,
    public UI: UIService,
  ) {
    this.device$
      .pipe(first())
      .subscribe((value) => this.deviceForm.setValue(value.device));

    this.deviceForm.valueChanges
      .pipe(filter(() => !this.isCordova))
      .subscribe((value: string) => this.system.setCurrentDevice(value));
  }

  setElkMode(value: boolean) {
    this.installationStore.update({ isElk: value });
    this.installBuild();
    this.UI.toggleSettings(false);
  }

  updateGame() {
    this.installationService
      .updateGame()
      .subscribe(() => console.log('GAME UPDATED'));
  }

  installAssets() {
    this.installationService
      .installAssets()
      .subscribe(() => console.log('ASSETS INSTALLED'));
  }

  installBuild() {
    this.installationService
      .installBuild()
      .subscribe(() => console.log('BUILD INSTALLED'));
  }
}
