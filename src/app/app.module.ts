import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgCoreModule } from './core/core.module';
import { InstancesContainerComponent } from './layout/instances-container/instances-container.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PhoneService } from './providers/application/phone/phone.service';
import { DtInputModule } from './ui/forms/input/input.module';
import { DtSelectModule } from './ui/forms/select/select.module';
import { DtButtonModule } from './ui/indicators/button/button.module';
import { DtContainerModule } from './ui/layout/container/container.module';

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

    DtButtonModule,
    DtContainerModule,
    DtInputModule,
    DtSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private phoneService: PhoneService) {
    if (!this.phoneService.isCordova) {
      this.phoneService.overrideUserAgent();
    } else {
      this.phoneService.setOrientation('landscape');
    }
  }
}
