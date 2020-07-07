import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UIService } from '@providers';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { overlayAnimation } from './game.animations';

@Component({
  selector: 'mg-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [overlayAnimation],
})
export class GameComponent implements OnInit {
  animationTrigger$ = combineLatest([
    this.UI.showAccounts$,
    this.UI.showSettings$,
    this.UI.showCreateAccount$,
  ]).pipe(map(() => Math.random().toString(36).split('.')[1]));

  constructor(public UI: UIService) {}
  ngOnInit(): void {}
}
