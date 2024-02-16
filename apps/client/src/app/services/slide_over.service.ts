import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideOverService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  toggle() { 
    const newValue = !this.isOpenSubject.value;
    this.isOpenSubject.next(newValue);
    console.log('toggle wurde aktiviert mit ' + newValue);
  }
}
