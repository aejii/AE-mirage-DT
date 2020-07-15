import { Injectable, NgZone } from '@angular/core';
import { GameInstance } from '@model';
import { EMPTY, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AccountsQuery } from './accounts.query';
import { Account, AccountsStore } from './accounts.store';
import { InstancesQuery } from './instances.query';
import { InstancesStore } from './instances.store';

@Injectable({
  providedIn: 'root',
})
export class InstancesService {
  accounts$ = this.accountsQuery.accounts$;

  instances$ = this.instancesQuery.selectAll();
  activeInstance$ = this.instancesQuery.selectActive();

  get activeInstance() {
    return this.instancesQuery.getActive();
  }

  constructor(
    private accountsQuery: AccountsQuery,
    private accountsStore: AccountsStore,
    private instancesQuery: InstancesQuery,
    private instancesStore: InstancesStore,
    private zone: NgZone,
  ) {}

  addAccount(account: Account) {
    this.accountsStore.addAccount(account.username, account.password);
  }

  removeAccount(account: Account) {
    this.accountsStore.remove(account.username);
  }

  updateAccountConnectionStatus(account: Account) {
    this.accountsStore.update(account.username, (state) => ({
      connects: !state.connects,
    }));
  }

  connectAccounts() {
    const instances = this.accountsQuery.accountsToConnect.map(
      (account) => new GameInstance(account),
    );

    const [leader, ...followers] = instances;

    const connectionProcess = instances.reduce((previous$, instance) => {
      return previous$.pipe(
        tap(() => this.addInstance(instance)),
        switchMap(() => instance.events.characterLogin$),
        tap(() => this._attachPictureToAccount(instance)),
        first(),
      );
    }, of(EMPTY));

    connectionProcess.subscribe(() => {
      followers.forEach((follower, index) => {
        follower.groupManager.acceptNextPartyInvite();
        setTimeout(
          () => leader.groupManager.sendPartyInviteTo(follower.character.name),
          500 * index,
        );
      });
    });
  }

  addInstance(instance = new GameInstance()): GameInstance {
    this.zone.run(() => {
      this.instancesStore.add(instance);
      this.setActiveInstance(instance);
    });
    return instance;
  }

  setActiveInstance(instance?: GameInstance) {
    this.zone.run(() => {
      // To blur any input that might have the focus (closes the phone keyboard)
      (document?.activeElement as HTMLElement)?.blur?.();
      this.activeInstance?.singletons.audioManager?.setMute?.(true);
      instance?.singletons.audioManager?.setMute?.(false);
      this.instancesStore.setActive(instance?.ID ?? null);
    });
  }

  previousInstance() {
    this.zone.run(() => {
      (document?.activeElement as HTMLElement)?.blur?.();
      this.activeInstance?.singletons.audioManager?.setMute?.(true);
      this.instancesStore.setActive({ prev: true });
      this.activeInstance?.singletons.audioManager?.setMute?.(false);
    });
  }
  nextInstance() {
    this.zone.run(() => {
      (document?.activeElement as HTMLElement)?.blur?.();
      this.activeInstance?.singletons.audioManager?.setMute?.(true);
      this.instancesStore.setActive({ next: true });
      this.activeInstance?.singletons.audioManager?.setMute?.(false);
    });
  }

  removeInstance(instance: GameInstance) {
    this.zone.run(() => {
      this.instancesStore.remove(instance?.ID);
      this.instancesStore.setActive(
        this.instancesQuery.getAll()?.[0]?.ID ?? null,
      );
    });
  }

  removeAllInstances() {
    this.instancesStore.set([]);
  }

  indexOfInstance(instance: GameInstance) {
    return this.instancesQuery.getAll().indexOf(instance);
  }

  /**
   * Uses an HTML dumpster to load a canvas, and converts this canvas to base64 to bind it to an account
   */
  private _attachPictureToAccount(instance: GameInstance) {
    const accountName = instance.account.username;
    const char = instance.gui.accountListImage;

    const charEl = char.rootElement;
    const canvasEl: HTMLCanvasElement = char.canvas.rootElement;
    const host: HTMLElement = document.querySelector('.canvas-dumpster');

    host.appendChild(charEl);

    setTimeout(() => {
      this.accountsStore.update(accountName as any, {
        lastImage: canvasEl.toDataURL(),
      });
      host.innerHTML = '';
    }, 1000);
  }
}
