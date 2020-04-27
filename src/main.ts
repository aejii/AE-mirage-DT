import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';
import { UserInterfaceState } from './app/core/user-interface/user-interface.store';

if (!window.cordova) bootstrapApp();
else
  document.addEventListener('deviceready', () => {
    enableProdMode();
    bootstrapApp();
  });

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
