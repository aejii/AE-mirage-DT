import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { InstallationService } from './core/installation/installation.service';

@Component({
  selector: 'mg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private installation: InstallationService) {
    this.installation.updateGame().subscribe(() => {
      console.log('Mirage is ready to run game instances');
    });
  }

  @HostListener('window:popstate', ['$event'])
  onBackButtonPressed(event) {
    // Array notation because apparently app doesn't exist
    // tslint:disable-next-line: no-string-literal
    navigator['app']['exitApp']();
  }
}
