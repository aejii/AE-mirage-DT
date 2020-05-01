import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgCoreModule } from './core/core.module';
import { MgFormsModule } from './design/forms/forms.module';
import { MgButtonModule } from './design/indicators/button/button.module';
import { MgLogoModule } from './design/indicators/logo/logo.module';
import { MgCardModule } from './design/layout/card/card.module';
import { InstancesContainerComponent } from './layout/instances-container/instances-container.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PhoneService } from './providers/application/phone/phone.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    AccountsComponent,
    InstancesContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFirePerformanceModule,
    // AngularFireAnalyticsModule,

    HttpClientModule,
    DragDropModule,

    MgCoreModule,

    FlexLayoutModule,
    MatIconModule,
    MgButtonModule,
    MgCardModule,
    MgFormsModule,
    MgLogoModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private registry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private phoneService: PhoneService,
  ) {
    this.registry.addSvgIcon(
      'mirage',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/logo.svg'),
    );

    if (!this.phoneService.isCordova) {
      this.phoneService.overrideUserAgent();
    } else {
      this.phoneService.setOrientation('landscape');
    }
  }
}
