import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { InstallationService } from './core/installation/installation.service';
import { UserInterfaceQuery } from './core/user-interface/user-interface.query';
import { UserInterfaceStore } from './core/user-interface/user-interface.store';
import { UserPreferencesQuery } from './core/user-preferences/user-preferences.query';

@Component({
  selector: 'mg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isMenuVisible$ = this.uiQuery.isMenuVisible$;

  hasInstances$ = this.uiQuery.instances$.pipe(
    map((instances) => !!instances.length),
  );

  navAlign$ = this.preferences.navAlign$;

  constructor(
    private uiStore: UserInterfaceStore,
    private uiQuery: UserInterfaceQuery,
    private installation: InstallationService,
    private preferences: UserPreferencesQuery,
  ) {
    this.installation.updateGame().subscribe(() => {
      console.log('Mirage is ready to run game instances');
    });
  }

  toggleMenu(forceValue?: boolean) {
    this.uiStore.toggleMenu(forceValue);
  }

  @HostListener('window:popstate', ['$event'])
  onBackButtonPressed(event) {
    // Array notation because apparently app doesn't exist
    // tslint:disable-next-line: no-string-literal
    navigator['app']['exitApp']();
  }
}
