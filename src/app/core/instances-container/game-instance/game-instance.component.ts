import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GameInstance } from '@model';
import { InstancesService } from '@providers';
import { concat, forkJoin, of, Subscription, timer } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';

@Component({
  selector: 'mg-game-instance',
  templateUrl: './game-instance.component.html',
  styleUrls: ['./game-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class GameInstanceComponent implements OnInit, OnDestroy {
  @Input() instance: GameInstance;

  src$ = this.installation.gamePath$;

  private susbscriptions = new Subscription();

  @ViewChild('partyInfoRef', { static: true }) partyInfoRef: ElementRef<
    HTMLElement
  >;

  constructor(
    private installation: InstallationService,
    private instancesService: InstancesService,
    private renderer: Renderer2,
    private zone: NgZone,
  ) {}

  ngOnDestroy() {
    this.susbscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.zone.run(() => {
      this._connectAccount();
      this._setActiveOnTurnStart();
      this.susbscriptions.add(
        this.instance.events.characterLogin$.subscribe(() => {
          this.instance.events.preventInactivity();
          this.instance.gui.removeShopButton();
          this.instance.shortcuts.addSpellsDoubleTapListener();
        }),
      );

      this.susbscriptions.add(
        this.instance.events.characterLogin$
          .pipe(switchMap(() => timer(60000, 60000)))
          .subscribe(() => this.instance.events.preventInactivity()),
      );

      this.susbscriptions.add(
        this.instance.events.characterLogin$
          .pipe(switchMap(() => this.instance.groupManager.partyInfo$))
          .subscribe(() => {
            const host = this.instance.gui.addPartyInfoPlaceHolder();
            // Either nowhere to put it, or already put
            if (!host) return;
            this.renderer.appendChild(host, this.partyInfoRef.nativeElement);
          }),
      );
    });

    // TODO (but not here) : create the finder in angular and let it act on the current instance
  }

  private _connectAccount(instance = this.instance) {
    if (!instance.account) return;

    instance.events.gameInit$
      .pipe(
        delay(500),
        tap(() => instance.window.gui.loginScreen.showLoginForm()),
        switchMap(() =>
          emulateUserTyping$(
            instance.gui.loginForm.username,
            instance.account.username,
          ),
        ),
        switchMap(() =>
          emulateUserTyping$(
            instance.gui.loginForm.password,
            instance.account.password,
          ),
        ),
      )
      .subscribe(() => {
        instance.gui.loginForm.rememberName.deactivate();
        instance.gui.loginForm.play();
      });
  }

  private _setActiveOnTurnStart() {
    this.susbscriptions.add(
      this.instance.events.characterFightTurnStart$.subscribe(() => {
        this.instancesService.setActiveInstance(this.instance);
      }),
    );
  }
}

function emulateUserTyping$(input: HTMLInputElement, content: string) {
  return forkJoin([
    concat(
      ...content.split('').map((letter) => of(letter).pipe(delay(50))),
    ).pipe(tap((letter) => (input.value += letter))),
  ]);
}
