import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { GameInstance } from '@model';
import { InstancesService } from '@providers';
import { concat, forkJoin, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';

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

  constructor(
    private installation: InstallationService,
    private instancesService: InstancesService,
  ) {}

  ngOnInit(): void {
    this._connectAccount();
    this._setActiveOnTurnStart();
    this.instance.events.characterLogin$.subscribe(() => {
      this.instance.events.preventInactivity();
      this.instance.gui.removeShopButton();
      this.instance.shortcuts.addSpellsDoubleTapListener();
    });
    // TODO (but not here) : create the finder in angular and let it act on the current instance
  }

  private _connectAccount(instance = this.instance) {
    if (!instance.account) return;

    instance.events.gameInit$.pipe(delay(500)).subscribe(() => {
      instance.window.gui.loginScreen.showLoginForm();

      const setUsername = emulateUserTyping$(
        this.instance.gui.loginForm.username,
        instance.account.username,
      );
      const setPassword = emulateUserTyping$(
        this.instance.gui.loginForm.password,
        instance.account.password,
      );

      setUsername.pipe(switchMap(() => setPassword)).subscribe(() => {
        this.instance.gui.loginForm.rememberName.deactivate();
        this.instance.gui.loginForm.play();
      });
    });
  }

  private _setActiveOnTurnStart() {
    this.instance.events.characterFightTurnStart$.subscribe(() => {
      this.instancesService.setActiveInstance(this.instance);
    });
  }
}

function emulateUserTyping$(input: HTMLInputElement, content: string) {
  return forkJoin([
    concat(
      ...content.split('').map((letter) => of(letter).pipe(delay(50))),
    ).pipe(tap((letter) => (input.value += letter))),
  ]);
}
