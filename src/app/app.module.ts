import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgCoreModule } from './core/core.module';
import { DtButtonModule } from './design/indicators/button/button.module';
import { DtContainerModule } from './design/layout/container/container.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AccountsMenuComponent } from './pages/game/accounts-menu/accounts-menu.component';
import { InstanceRefDirective } from './pages/game/accounts-menu/instance-ref.directive';
import { GameComponent } from './pages/game/game.component';
import { MainMenuComponent } from './pages/game/main-menu/main-menu.component';
import { InstallerComponent } from './pages/installer/installer.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SystemService } from '@providers';
import { DtInputModule } from './design/forms/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DtSelectModule } from './design/forms/select/select.module';
import { CreateAccountComponent } from './pages/accounts/create-account/create-account.component';

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
