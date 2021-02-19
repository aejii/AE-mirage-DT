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
    window.mgFind = (matcher, configuration) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.mirageoldFinder(matcher, configuration);
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
