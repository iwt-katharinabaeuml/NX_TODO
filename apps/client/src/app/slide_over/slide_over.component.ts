import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideOverService } from '../services/slide_over.service';

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

  showAllOptions$ = this.slideOverService.showAllOptions$;
  
  toggleSlideOver(): void {
    this.slideOverService.toggle();
  }
  active: boolean = false;

  changeStatus(): void {

    this.active = !this.active;
  }

  @ViewChild('descriptionInput', { static: true }) descriptionInput!: ElementRef
  @ViewChild('creationDateYear', { static: true }) creationDateYear!: ElementRef 
  @ViewChild('creationDateMonth', { static: true }) creationDateMonth!: ElementRef 
  @ViewChild('creationDateDay', { static: true }) creationDateDay!: ElementRef 
  @ViewChild('completionDateYear', { static: false }) completionDateYear!: ElementRef 
  @ViewChild('completionDateMonth', { static: false }) completionDateMonth!: ElementRef
  @ViewChild('completionDateDay', { static: false }) completionDateDay!: ElementRef 

  clearInputFields(): void {
 
    this.descriptionInput.nativeElement.value = null;
    this.creationDateDay.nativeElement.value = null;
    this.creationDateMonth.nativeElement.value = null;
    this.creationDateYear.nativeElement.value = null;
    this.completionDateYear.nativeElement.value = null;
    this.completionDateMonth.nativeElement.value = null;
    this.completionDateDay.nativeElement.value = null;
  }

  @ViewChild('nonePriorityRadioButton')
  nonePriorityRadioButton!: ElementRef<HTMLInputElement>;
  clearPrioritySelection(): void {
    this.nonePriorityRadioButton.nativeElement.checked = true;

    console.log(
      'is it checked ' + this.nonePriorityRadioButton.nativeElement.checked
    );
  }

 
}
