import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideOverService } from '../services/slide_over.service';
import { ApiService } from '../services/api.service';
import { Priority, TaskDto } from '../services/api-interfaces';

import { TaskService } from '../services/task.service';

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
    private renderer: Renderer2,
    private apiService: ApiService,
    private taskService: TaskService
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

  @ViewChild('descriptionInput', { static: true })
  descriptionInput!: ElementRef;
  @ViewChild('creationDateYear', { static: true })
  creationDateYear!: ElementRef;
  @ViewChild('creationDateMonth', { static: true })
  creationDateMonth!: ElementRef;
  @ViewChild('creationDateDay', { static: true }) creationDateDay!: ElementRef;
  @ViewChild('completionDateYear', { static: false })
  completionDateYear!: ElementRef;
  @ViewChild('completionDateMonth', { static: false })
  completionDateMonth!: ElementRef;
  @ViewChild('completionDateDay', { static: false })
  completionDateDay!: ElementRef;

  @ViewChild('nonePriorityRadioButton')
  nonePriorityRadioButton!: ElementRef<HTMLInputElement>;
  @ViewChild('highPriorityRadioButton')
  highPriorityRadioButton!: ElementRef<HTMLInputElement>;
  @ViewChild('mediumPriorityRadioButton')
  mediumPriorityRadioButton!: ElementRef<HTMLInputElement>;
  @ViewChild('lowPriorityRadioButton')
  lowPriorityRadioButton!: ElementRef<HTMLInputElement>;

  clearInputFields(): void {
    this.descriptionInput.nativeElement.value = null;
    this.creationDateDay.nativeElement.value = null;
    this.creationDateMonth.nativeElement.value = null;
    this.creationDateYear.nativeElement.value = null;
    this.completionDateYear.nativeElement.value = null;
    this.completionDateMonth.nativeElement.value = null;
    this.completionDateDay.nativeElement.value = null;
  }

  completionDay: number = 0;
  completionMonth: number = 0;
  completionYear: number = 0;

  task: TaskDto = {
    id: '',
    description: '',
    creationDate: new Date(),
    completionDate: new Date(),
    completed: true,
    priority: Priority.high,
  };
  setInputFields(id: any): void {
    this.apiService.getDataById(id).subscribe((data: TaskDto) => {
      this.task.id = data.id;
      this.task.description = data.description;
      this.task.creationDate = data.creationDate;
      this.task.completionDate = data.completionDate;
      this.task.completed = data.completed;
      this.task.priority = data.priority;

      this.transformCreationDate(this.task.creationDate);
      this.transformCompletionDate(this.task.completionDate);

      this.descriptionInput.nativeElement.value = this.task.description;
      if (this.task.completed === true) {
        this.active = true;
      } else {
        this.active = false;
      }

      if (this.task.priority === 'high') {
        this.highPriorityRadioButton.nativeElement.checked = true;
        this.mediumPriorityRadioButton.nativeElement.checked = false;
        this.lowPriorityRadioButton.nativeElement.checked = false;
        this.nonePriorityRadioButton.nativeElement.checked = false;
      } else if (this.task.priority === 'medium') {
        this.highPriorityRadioButton.nativeElement.checked = false;
        this.mediumPriorityRadioButton.nativeElement.checked = true;
        this.lowPriorityRadioButton.nativeElement.checked = false;
        this.nonePriorityRadioButton.nativeElement.checked = false;
      } else if (this.task.priority === 'low') {
        this.highPriorityRadioButton.nativeElement.checked = false;
        this.mediumPriorityRadioButton.nativeElement.checked = false;
        this.lowPriorityRadioButton.nativeElement.checked = true;
        this.nonePriorityRadioButton.nativeElement.checked = false;
      } else if (this.task.priority === 'none') {
        this.highPriorityRadioButton.nativeElement.checked = false;
        this.mediumPriorityRadioButton.nativeElement.checked = false;
        this.lowPriorityRadioButton.nativeElement.checked = false;
        this.nonePriorityRadioButton.nativeElement.checked = true;
      }
    });
  }

  taskId: any;
  clearPrioritySelection(): void {
    this.nonePriorityRadioButton.nativeElement.checked = true;
  }

  ngOnInit() {
    this.taskService.taskId$.subscribe((taskId) => {
      this.taskId = taskId;
      this.setInputFields(this.taskId);
    });
  }

  transformCreationDate(dateString: any) {
    const date = new Date(dateString);
    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1; // Monate sind nullbasiert, daher +1
    const DD = date.getDate();

    this.creationDateYear.nativeElement.value = YYYY;
    this.creationDateMonth.nativeElement.value = MM;
    this.creationDateDay.nativeElement.value = DD;
  }
  transformCompletionDate(dateString: any) {
    let date = new Date(dateString);
    let YYYY = date.getFullYear();
    let MM = date.getMonth() + 1; // Monate sind nullbasiert, daher +1
    let DD = date.getDate();
  
    if (isNaN(YYYY) || isNaN(MM) || isNaN(DD)) {
      this.completionDateYear.nativeElement.value = '';
      this.completionDateMonth.nativeElement.value = '';
      this.completionDateDay.nativeElement.value = '';
    } else {
      this.completionDateYear.nativeElement.value = YYYY;
      this.completionDateMonth.nativeElement.value = MM;
      this.completionDateDay.nativeElement.value = DD;
    }
  }

  slideFields$ = this.slideOverService.slideFields$;
}
