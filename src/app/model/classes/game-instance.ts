import { DTWindow } from '../DT/window';
import { MgActionsHandler } from '../mirage/actions';
import { MgCharacterHandler } from '../mirage/character';
import { MgEventsHandler } from '../mirage/events';
import { MgFightHandler } from '../mirage/fights';
import { MgFinder } from '../mirage/finder';
import { MgGroupHandler } from '../mirage/group';
import { MgGuiHandler } from '../mirage/gui';
import { MgSingletons } from '../mirage/singletons';

export class GameInstance {
  public readonly ID = Math.random().toString(36).slice(2);

  public window: DTWindow;

  public events = new MgEventsHandler(this);
  public character = new MgCharacterHandler(this);
  public gui = new MgGuiHandler(this);
  public shortcuts = new MgActionsHandler(this);
  public fightManager = new MgFightHandler(this);
  public groupManager = new MgGroupHandler(this);
  public finder = new MgFinder(this);
  public singletons = new MgSingletons(this);

  constructor(
    public account?: {
      username: string;
      password: string;
    },
  ) {}

  /**
   * Attaches a frame window to the instance
   * @param window Frame window object
   */
  frameLoaded(frame: HTMLIFrameElement) {
    this.window = frame.contentWindow as DTWindow;
  }
}
