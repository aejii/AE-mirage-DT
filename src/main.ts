import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';
import { UserInterfaceState } from './app/core/user-interface/user-interface.store';
import { environment } from './environments/environment';

if (environment.production)
  document.addEventListener('deviceready', () => {
    window.screen.orientation.lock('landscape');
    enableProdMode();
    bootstrapApp();
  });
else bootstrapApp();

function bootstrapApp() {
  persistState({
    include: ['user-interface', 'user-preferences'],
    preStorageUpdate,
  });
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

function preStorageUpdate(name, state) {
  switch (name) {
    case 'user-interface':
      const {
        activeInstance,
        instances,
        ...uiState
      } = state as UserInterfaceState;
      return uiState;
    default:
      return state;
  }
}
