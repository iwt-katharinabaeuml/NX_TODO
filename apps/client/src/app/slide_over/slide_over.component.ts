import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideOverService } from '../services/slide_over.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'fse-slide-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide_over.component.html',
  styleUrls: ['./slide_over.component.scss'],
})
export class SlideOverComponent {
  @ViewChild('panel', { static: false }) panel: ElementRef | undefined;
  @ViewChild('dialog', { static: false }) dialog: ElementRef | undefined;

  constructor(
    private slideOverService: SlideOverService,
    private renderer: Renderer2
  ) {
    this.isOpen$.subscribe((isOpen) => {
      if (this.panel === undefined) return;

      if (this.dialog === undefined) return;

      if (isOpen) {
        this.renderer['removeClass'](
          this.panel.nativeElement,
          'translate-x-full'
        );
        this.renderer['addClass'](this.panel.nativeElement, 'translate-x-0');
        this.renderer['removeClass'](
          this.dialog.nativeElement,
          'pointer-events-none'
        );
      } else {
        this.renderer['removeClass'](this.panel.nativeElement, 'translate-x-0');
        this.renderer['addClass'](this.panel.nativeElement, 'translate-x-full');
        this.renderer['addClass'](
          this.dialog.nativeElement,
          'pointer-events-none'
        );
      }
    });
  }

  isOpen$ = this.slideOverService.isOpen$;

  toggleSlideOver(): void {
    this.slideOverService.toggle();
  }
  active: boolean = true;

  changeStatus(): void {
    this.active = !this.active;
  }

  @ViewChild('descriptionInput', { static: true }) descriptionInput: any;
  @ViewChild('creationDateYear', { static: true }) creationDateYear: any;
  @ViewChild('creationDateMonth', { static: true }) creationDateMonth: any;
  @ViewChild('creationDateDay', { static: true }) creationDateDay: any;
  @ViewChild('deletionDateYear', { static: true }) deletionDateYear: any;
  @ViewChild('deletionDateMonth', { static: true }) deletionDateMonth: any;
  @ViewChild('deletionDateDay', { static: true }) deletionDateDay: any;

  clearInputFields(): void {
    console.log(
      'clearing the value',
      this.descriptionInput.nativeElement.value
    );
    this.descriptionInput.nativeElement.value = null;
    this.creationDateDay.nativeElement.value = null;
    this.creationDateMonth.nativeElement.value = null;
    this.creationDateYear.nativeElement.value = null;
    this.deletionDateYear.nativeElement.value = null;
    this.deletionDateMonth.nativeElement.value = null;
    this.deletionDateDay.nativeElement.value = null;
  }

  // private isOpenMenu = new BehaviorSubject<boolean>(false);

  // menuOpen$ = this.isOpenMenu.asObservable();

  // toggle() {
  //   const newValue = !this.isOpenMenu.value;
  //   this.isOpenMenu.next(newValue);
  //   console.log('Menu toggle wurde aktiviert mit ' + newValue);
  // }
}
