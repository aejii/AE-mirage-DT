import { Injectable } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AccountsQuery } from './accounts.query';
import { Account, AccountsStore } from './accounts.store';
import { InstancesQuery } from './instances.query';
import { InstancesStore } from './instances.store';
import { GameInstance } from '@model';

@Injectable({
  providedIn: 'root',
})
export class InstancesService {
  accounts$ = this.accountsQuery.selectAll();

  instances$ = this.instancesQuery.selectAll();
  activeInstance$ = this.instancesQuery.selectActive();

  constructor(
    private accountsQuery: AccountsQuery,
    private accountsStore: AccountsStore,
    private instancesQuery: InstancesQuery,
    private instancesStore: InstancesStore,
  ) {}

  addAccount(account: Account) {
    this.accountsStore.add(account);
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
    const instances = this.accountsQuery
      .getAll()
      .filter((account) => account.connects)
      .map((account) => new GameInstance(account));

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
        follower.events.acceptNextPartyInvite();
        setTimeout(
          () => leader.events.sendPartyInviteTo(follower.character.name),
          500 * index,
        );
      });
    });
  }

  addInstance(instance = new GameInstance()): GameInstance {
    this.instancesStore.add(instance);
    this.setActiveInstance(instance);
    return instance;
  }

  setActiveInstance(instance?: GameInstance) {
    this.instancesStore.setActive(instance?.ID ?? null);

    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  }

  removeInstance(instance: GameInstance) {
    this.instancesStore.remove(instance?.ID);
    this.instancesStore.setActive(
      this.instancesQuery.getAll()?.[0]?.ID ?? null,
    );
  }

  removeAllInstances() {
    this.instancesStore.set([]);
  }

  indexOfInstance(instance: GameInstance) {
    return this.instancesQuery.getAll().indexOf(instance);
  }

  // TODO Rewrite
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
