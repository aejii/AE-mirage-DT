import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { InstancesService, KeyboardShortcutsService } from '@providers';
import { DTWindow } from 'src/app/model/DT/window';

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
    (window as any).wFind = (
      matcher: string | RegExp,
      depth: number,
      override: (window: DTWindow) => any,
    ) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.searchForKeyInWindowObjects(
        matcher,
        depth,
        override,
      );
    };

    (window as any).sFind = (matcher: string | RegExp, depth: number) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.searchForKeyInSingletonObjects(matcher, depth);
    };

    (window as any).fnFind = (keys: string | string[]) => {
      const instance = this.instancesService.activeInstance;
      return instance.finder.searchForSingletonConstructorWithKey(keys);
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
