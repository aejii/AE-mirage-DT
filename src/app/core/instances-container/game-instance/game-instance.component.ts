import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { InstallationService } from 'src/app/core/installation/installation.service';
import { GameInstance } from './game-instance.class';
import { UserInterfaceStore } from '../../user-interface/user-interface.store';

@Component({
  selector: 'mg-game-instance',
  templateUrl: './game-instance.component.html',
  styleUrls: ['./game-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class GameInstanceComponent implements OnInit {
  @Input() instance: GameInstance;

  src$ = this.installation.gamePath$;

  constructor(private installation: InstallationService, private store: UserInterfaceStore) {}

  ngOnInit(): void {
    this.instance.fightTurnStart$.subscribe(() => {
      this.store.setActiveInstance(this.instance);
    });
  }
}
