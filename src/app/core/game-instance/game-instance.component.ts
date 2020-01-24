import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { InstallationService } from 'src/app/core/installation/installation.service';
import { GameInstance } from '../model/game/instance.class';

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

  constructor(private installation: InstallationService) {}

  ngOnInit(): void {
    // If input not provided (mono-account mode)
    if (!this.instance) this.instance = new GameInstance();
  }
}
