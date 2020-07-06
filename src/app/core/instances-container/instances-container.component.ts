import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { InstancesService } from '@providers';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mg-instances-container',
  templateUrl: './instances-container.component.html',
  styleUrls: ['./instances-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancesContainerComponent implements OnInit {
  instances$ = this.instancesService.instances$;
  active$ = this.instancesService.activeInstance$.pipe(
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  constructor(
    private cdRef: ChangeDetectorRef,
    private instancesService: InstancesService,
  ) {}

  ngOnInit() {}
}
