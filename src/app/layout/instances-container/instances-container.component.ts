import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserInterfaceQuery } from 'src/app/core/user-interface/user-interface.query';

@Component({
  selector: 'mg-instances-container',
  templateUrl: './instances-container.component.html',
  styleUrls: ['./instances-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancesContainerComponent implements OnInit {
  instances$ = this.interfaceQuery.instances$;
  active$ = this.interfaceQuery.activeInstance$;

  constructor(private interfaceQuery: UserInterfaceQuery) {}

  ngOnInit() {}
}
