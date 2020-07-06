import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { installerAnimation } from './app.animations';
import { InstallationService } from './core/installation/installation.service';
import { UIService } from '@providers';

@Component({
  selector: 'mg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [installerAnimation],
})
export class AppComponent implements OnInit {
  showInstaller$ = this.UI.showInstaller$;

  constructor(
    private installation: InstallationService,
    public UI: UIService,
  ) {}

  ngOnInit() {
    // Install the game when the application starts
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
