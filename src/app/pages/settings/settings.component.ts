import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SystemService, UIService } from '@providers';
import { filter, first } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';
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

  constructor(
    private cdRef: ChangeDetectorRef,
    private installationService: InstallationService,
    private installationQuery: InstallationQuery,
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

  updateGame() {
    this.installationService.updateGame().subscribe(() => {
      console.log('GAME UPDATED');
      this.cdRef.detectChanges();
    });
  }

  installAssets() {
    this.installationService.installAssets().subscribe(() => {
      console.log('ASSETS INSTALLED');
      this.cdRef.detectChanges();
    });
  }

  installBuild() {
    this.installationService.installBuild().subscribe(() => {
      console.log('BUILD INSTALLED');
      this.cdRef.detectChanges();
    });
  }
}
