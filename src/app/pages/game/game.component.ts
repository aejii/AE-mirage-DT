import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UIService } from '@providers';

@Component({
  selector: 'mg-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  constructor(public UI: UIService) {}
  ngOnInit(): void {}
}
