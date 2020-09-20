import { fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DTWindow } from '../DT/window';
import { MgActionsHandler } from '../mirage/actions';
import { MgCharacterHandler } from '../mirage/character';
import { MgEventsHandler } from '../mirage/events';
import { MgFightHandler } from '../mirage/fights';
import { MgFinder } from '../mirage/finder';
import { MgGroupHandler } from '../mirage/group';
import { MgGuiHandler } from '../mirage/gui';
import { MgInjecter } from '../mirage/injecter';
import { MgMerchant } from '../mirage/merchant';
import { MgSingletons } from '../mirage/singletons';

export class GameInstance {
  public readonly ID = Math.random().toString(36).slice(2);

  public window: DTWindow;

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
    this.window = frame.contentWindow as DTWindow;
    /**
     * Uses Mirage log system to persist the console actions into the local storage
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
