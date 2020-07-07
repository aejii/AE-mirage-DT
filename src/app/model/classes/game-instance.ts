import { DTWindow } from '../DT/window';
import { MgCharacter } from '../mirage/character';
import { MgEventsHandler } from '../mirage/events-handler';
import { MgFightHandler } from '../mirage/fights-handler';
import { MgGuiHandler } from '../mirage/gui-handler';
import { MgShortcutsHandler } from '../mirage/shortcuts-handler';
import { MgGroupHandler } from '../mirage/group-handler';

export class GameInstance {
  public readonly ID = Math.random().toString(36).slice(2);

  public window: DTWindow;

  public events = new MgEventsHandler(this);
  public character = new MgCharacter(this);
  public gui = new MgGuiHandler(this);
  public shortcuts = new MgShortcutsHandler(this);
  public fightManager = new MgFightHandler(this);
  public groupManager = new MgGroupHandler(this);

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
