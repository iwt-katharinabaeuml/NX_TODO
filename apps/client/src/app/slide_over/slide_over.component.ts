import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideOverService } from '../services/slide_over.service';
import { ApiService } from '../services/api.service';
import { Priority, TaskDto, UpdateTaskDto } from '../services/api-interfaces';
import { TaskService } from '../services/task.service';
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

  private isOpenSubjectAltert = new BehaviorSubject<boolean>(false);
  alertIsShown$ = this.isOpenSubjectAltert.asObservable();

  showAlert(isShown: boolean) {
    const newValue = isShown;
    this.isOpenSubjectAltert.next(newValue);
  }

  isOpen$ = this.slideOverService.isOpen$;

  showAllOptions$ = this.slideOverService.showAllOptions$;

  alertInfo = '';

  toggleSlideOver(): void {
    this.taskService.fetchTasks();
    this.slideOverService.toggle();
  }
  active: boolean = false;

  changeStatus(): void {
    this.active = !this.active;
  }

  @ViewChild('alertBox', { static: true })
  alertBox!: ElementRef;

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
    this.creationDateDay.nativeElement.value = this.currentDate.day;
    this.creationDateMonth.nativeElement.value = this.currentDate.month;
    this.creationDateYear.nativeElement.value = this.currentDate.year;
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

      if (this.task.completionDate !== undefined) {
        this.transformCompletionDate(this.task.completionDate);
      }
      if (data.completionDate === ('1970-01-01T00:00:00.000Z' as any)) {
        (this.completionDateYear.nativeElement.value = ''),
          (this.completionDateMonth.nativeElement.value = ''),
          (this.completionDateDay.nativeElement.value = '');
      }
      if (!data.completionDate ) {
        (this.completionDateYear.nativeElement.value = ''),
          (this.completionDateMonth.nativeElement.value = ''),
          (this.completionDateDay.nativeElement.value = '');
      }
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

  updatedTaskBody: UpdateTaskDto = {
    description: '',
    creationDate: new Date(),
    completionDate: new Date(),
    priority: Priority.none,
    completed: false,
  };
  updateTask() {
    let priority = Priority.none;
    let completed = false;

    if (this.highPriorityRadioButton.nativeElement.checked) {
      priority = Priority.high;
    } else if (this.mediumPriorityRadioButton.nativeElement.checked) {
      priority = Priority.medium;
    } else if (this.lowPriorityRadioButton.nativeElement.checked) {
      priority = Priority.low;
    }

    // Überprüfen, ob completionDate existiert
    if (
      this.completionDateYear.nativeElement.value !== '' ||
      this.completionDateMonth.nativeElement.value !== '' ||
      this.completionDateDay.nativeElement.value !== ''
    ) {
      completed = true; // Wenn completionDate vorhanden ist, setze completed auf true
    } else {
      completed = this.active; // Andernfalls verwende den aktuellen Wert von "active"
    }

    let updatedTaskBody: UpdateTaskDto = {
      description: this.descriptionInput.nativeElement.value,
      creationDate: this.createDateFromValues(
        this.creationDateYear.nativeElement.value,
        this.creationDateMonth.nativeElement.value,
        this.creationDateDay.nativeElement.value
      ) as any,
      completionDate: this.createDateFromValues(
        this.completionDateYear.nativeElement.value,
        this.completionDateMonth.nativeElement.value,
        this.completionDateDay.nativeElement.value
      ) as any,
      priority: priority,
      completed: completed,
    };

    if (updatedTaskBody.description.length <= 1) {
      this.alertInfo = 'Please add a description';
      this.showAlert(true);
    } else {
      this.showAlert(false);
      console.log(
        'der Alters sollte nicht gezeigt werden: ' + this.alertIsShown$
      );
    }

    this.apiService.updateDateById(this.taskId, updatedTaskBody).subscribe(
      (response) => {
        this.taskService.fetchTasks();
        this.toggleSlideOver();
      },
      (error) => {
        console.error('Fehler beim Aktualisieren des Tasks', error);
      }
    );

    this.clearInputFields();
  }

  createDateFromValues(
    year: number,
    month: number,
    day: number
  ): string | null {
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null;
    }

    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return null;
    }

    const isoString = `${date.toISOString().slice(0, 19)}.${date
      .getUTCMilliseconds()
      .toString()
      .padStart(3, '0')}Z`;
    return isoString;
  }

  createNewTask() {
    let priority = Priority.none;
    let completed = false;

    if (this.highPriorityRadioButton.nativeElement.checked) {
      priority = Priority.high;
    } else if (this.mediumPriorityRadioButton.nativeElement.checked) {
      priority = Priority.medium;
    } else if (this.lowPriorityRadioButton.nativeElement.checked) {
      priority = Priority.low;
    }

    const newTaskBody: UpdateTaskDto = {
      description: this.descriptionInput.nativeElement.value,
      creationDate: this.createDateFromValues(
        this.creationDateYear.nativeElement.value,
        this.creationDateMonth.nativeElement.value,
        this.creationDateDay.nativeElement.value
      ) as any,
      completionDate: null as any,
      priority: priority,
      completed: completed,
    };

    console.log('New Task', newTaskBody);

    this.apiService.createTask(newTaskBody).subscribe(
      (response) => {
        console.log('Task erfolgreich erstellt', response);
      },
      (error) => {
        console.error('Fehler beim Erstellen des Tasks', error);
      }
    );
    this.taskService.fetchTasks();
    this.clearInputFields();
  }
  deleteTask(id: any) {
    this.taskService.deleteTask(id);
  }

  currentDate = {
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0'),
  };
}
