import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from 'ngx-entity-store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { STORE_STATE } from './core/models/state';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [provideStore({ state: STORE_STATE })],
  bootstrap: [AppComponent],
})
export class AppModule {}
