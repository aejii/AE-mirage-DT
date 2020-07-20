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
