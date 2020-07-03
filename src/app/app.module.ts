import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgCoreModule } from './core/core.module';
import { DtButtonModule } from './design/indicators/button/button.module';
import { DtContainerModule } from './design/layout/container/container.module';
import { PhoneService } from './providers/application/phone/phone.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFirePerformanceModule,
    // AngularFireAnalyticsModule,

    MgCoreModule,

    DtContainerModule,
    DtButtonModule,
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
