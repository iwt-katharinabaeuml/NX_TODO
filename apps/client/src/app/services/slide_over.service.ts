import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlideOverService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  public showAllOptions = new BehaviorSubject<Boolean>(false);
  showAllOptions$ = this.showAllOptions.asObservable();

  toggle() {
    const newValue = !this.isOpenSubject.value;
    this.isOpenSubject.next(newValue);
    console.log('toggle wurde aktiviert mit ' + newValue);
  }

  showAll(showOption: boolean) {
    const newValue = showOption;
    this.showAllOptions.next(newValue);
    console.log(newValue);
  }

  private slideFields: any = {};
  private slideFieldsSubject = new BehaviorSubject<any>(this.slideFields); 
  slideFields$: Observable<any> = this.slideFieldsSubject.asObservable();

  setSliderHeader(header: string, description: string, button: string): void {
    const slideFields = {
      slideHeader: header,
      slideDescription: description,
      slideButton: button
    };
    this.slideFields = slideFields;
    this.slideFieldsSubject.next(slideFields);
    console.log('slideFields im Server', slideFields);
  }

}

@Injectable({
  providedIn: 'root',
})
export class MenuSlideService {
  private isOpenMenu = new BehaviorSubject<boolean>(false);

  menuOpen$ = this.isOpenMenu.asObservable();

  toggle() {
    const newValue = !this.isOpenMenu.value;
    this.isOpenMenu.next(newValue);
    console.log('Menu toggle wurde aktiviert mit ' + newValue);
  }
}
