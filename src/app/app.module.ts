import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtButtonModule,
  DtContainerModule,
  DtInputModule,
  DtListModule,
  DtSelectModule,
} from '@design';
import { SystemService } from '@providers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgCoreModule } from './core/core.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CreateAccountComponent } from './pages/accounts/create-account/create-account.component';
import { AccountsMenuComponent } from './pages/game/accounts-menu/accounts-menu.component';
import { InstanceRefDirective } from './pages/game/accounts-menu/instance-ref.directive';
import { GameComponent } from './pages/game/game.component';
import { MainMenuComponent } from './pages/game/main-menu/main-menu.component';
import { InstallerComponent } from './pages/installer/installer.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { KeyboardBindingsComponent } from './pages/settings/keyboard-bindings/keyboard-bindings.component';

@NgModule({
  declarations: [
    AppComponent,
    InstallerComponent,
    SettingsComponent,
    GameComponent,
    MainMenuComponent,
    AccountsMenuComponent,
    InstanceRefDirective,
    AccountsComponent,
    CreateAccountComponent,
    KeyboardBindingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFirePerformanceModule,
    // AngularFireAnalyticsModule,

    MgCoreModule,

    DtContainerModule,
    DtButtonModule,
    DtInputModule,
    DtSelectModule,
    DtListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private phoneService: SystemService) {
    if (this.phoneService.isCordova) {
      this.phoneService.setPhoneOrientation('landscape');
    } else {
      this.phoneService.overrideUserAgent();
    }
  }
}
