import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuSlideService, SlideOverService } from './services/slide_over.service';
import { HttpClientModule } from '@angular/common/http'
import { ApiService } from './services/api.service';

@NgModule({

  imports: [
    BrowserModule,
    BrowserAnimationsModule, HttpClientModule,
  ],
  providers: [
    SlideOverService, MenuSlideService, ApiService
  ],
  bootstrap: []
})
export class AppModule { }