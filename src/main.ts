import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';
import { UserPreferencesState } from './app/core/user-preferences/user-preferences.store';

if (!window.cordova) bootstrapApp();
else
  document.addEventListener('deviceready', () => {
    enableProdMode();
    bootstrapApp();
  });

function bootstrapApp() {
  persistState({
    include: ['user-preferences'],
    preStorageUpdate,
  });
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

function preStorageUpdate(name, state) {
  switch (name) {
    case 'user-interface':
      const uiState = state as UserPreferencesState;
      return uiState;
    default:
      return state;
  }
}
