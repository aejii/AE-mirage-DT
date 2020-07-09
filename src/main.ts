import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';

if (!window.cordova) bootstrapApp();
else
  document.addEventListener('deviceready', () => {
    bootstrapApp();
  });

function bootstrapApp() {
  enableProdMode();
  persistState({
    include: ['accounts', 'user-agent', 'installation'],
    preStorageUpdate,
  });
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

function preStorageUpdate(name, state) {
  switch (name) {
    case 'user-agent':
      const { active } = state;
      return { active };
    case 'installation':
      const { isElk } = state;
      return { isElk };
    default:
      return state;
  }
}
