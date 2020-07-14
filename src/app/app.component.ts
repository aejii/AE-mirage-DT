import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';
import { UIService } from '@providers';
import { appAnimation } from './app.animations';
import { InstallationService } from './core/installation/installation.service';

@Component({
  selector: 'mg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [appAnimation],
})
export class AppComponent implements OnInit {
  showInstaller$ = this.UI.showInstaller$;

  @HostBinding('@app') get bounceAnim() {
    return new AsyncPipe(this.cdRef).transform(this.showInstaller$);
  }

  constructor(
    private installation: InstallationService,
    public UI: UIService,
    private cdRef: ChangeDetectorRef,
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

  // Prevent the window from closing with a Ctrl + W keydown event
  @HostListener('window:keydown', ['$event'])
  onKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'w' && event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
