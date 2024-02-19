import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuSlideService, SlideOverService } from './services/slide_over.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    SlideOverService, MenuSlideService
  ],
  bootstrap: [ ]
})
export class AppModule { }