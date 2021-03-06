import { fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DTWindow } from '../DT/window';
import { MgActionsHandler } from '../mirageold/actions';
import { MgCharacterHandler } from '../mirageold/character';
import { MgEventsHandler } from '../mirageold/events';
import { MgFightHandler } from '../mirageold/fights';
import { MgFinder } from '../mirageold/finder';
import { MgGroupHandler } from '../mirageold/group';
import { MgGuiHandler } from '../mirageold/gui';
import { MgInjecter } from '../mirageold/injecter';
import { MgMerchant } from '../mirageold/merchant';
import { MgSingletons } from '../mirageold/singletons';
import { MgSpellsManager } from '../mirageold/spells';

export class GameInstance {
  public readonly ID = Math.random().toString(36).slice(2);

  public window: DTWindow & typeof globalThis;

  public events = new MgEventsHandler(this);
  public singletons = new MgSingletons(this);
  public injecter = new MgInjecter(this);
  public gui = new MgGuiHandler(this);
  public actions = new MgActionsHandler(this);
  public fightManager = new MgFightHandler(this);
  public groupManager = new MgGroupHandler(this);
  public character = new MgCharacterHandler(this);
  public finder = new MgFinder(this);
  public merchant = new MgMerchant(this);
  public spells = new MgSpellsManager(this);

  constructor(
    public account?: {
      username: string;
      password: string;
    },
  ) {
    this._enableUiResizingOnWindowResizing();

    this.events.subscriptions.add(
      this.events.characterLogin$.subscribe(() => {
        this.injecter.manageQuickExchange();
      }),
    );
  }

  /**
   * Attaches a frame window to the instance
   * @param window Frame window object
   */
  frameLoaded(frame: HTMLIFrameElement) {
    this.window = frame.contentWindow as any;
    /**
     * Uses mirageold log system to persist the console actions into the local storage
     */
    this.window.addEventListener('error', (...args) =>
      (this.window.top as any).mgLog(...args),
    );

    // Binds the window console to the app console
    Object.defineProperty(this.window, 'console', {
      value: console,
    });

    // remove the ability to send logs to dofus touch
    const orgn = this.window.fetch.bind(this.window);
    this.window.fetch = (...args) => {
      const endpoint: string = args[0] as any;
      if (endpoint.endsWith('/logger')) return;
      return orgn(...args);
    };
  }

  private _enableUiResizingOnWindowResizing() {
    this.events.gameInit$
      .pipe(
        switchMap(() => fromEvent(this.window, 'resize')),
        debounceTime(100),
      )
      .subscribe(() => {
        this.actions.refreshInterface();
        this.actions.removeShopButton();
      });
  }
}
