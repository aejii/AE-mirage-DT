import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { InstancesService, KeyboardShortcutsService } from '@providers';

@Component({
  selector: 'mg-instances-container',
  templateUrl: './instances-container.component.html',
  styleUrls: ['./instances-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancesContainerComponent implements OnInit {
  instances$ = this.instancesService.instances$;
  active$ = this.instancesService.activeInstance$;

  constructor(
    private instancesService: InstancesService,
    private shortcuts: KeyboardShortcutsService,
  ) {}

  ngOnInit() {
    // tslint:disable-next-line: no-string-literal
    window['wFind'] = (matcher, depth, override) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.findKeyInWindow(matcher, depth, override);
    };
    // tslint:disable-next-line: no-string-literal
    window['sFind'] = (matcher, depth) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.findKeyInSingleton(matcher, depth);
    };
  }

  // Because the activeElement is blurred on active instance change
  @HostListener('window:keydown', ['$event'])
  onKeyPressed(event: KeyboardEvent) {
    if (event.repeat) return;
    const activeInstance = this.instancesService.activeInstance;
    this.shortcuts.runShortcut(activeInstance, event);
  }
}
