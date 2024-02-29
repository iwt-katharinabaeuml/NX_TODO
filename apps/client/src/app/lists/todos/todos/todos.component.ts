import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../shared/task.model';

import { SlideOverService } from '../../../services/slide_over.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'fse-todos',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  tasks: Task[] = [];
  isOpen = false;
  responseData: any;

  constructor(
    private renderer: Renderer2,
    private slideOverService: SlideOverService,
    private apiService: ApiService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();

    this.slideOverService.isOpen$.subscribe((isOpen$) => {
      this.isOpen = isOpen$;
    });
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.taskService.tasksChanged.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      console.log(tasks)
    });

    this.apiService.getData().subscribe(
      (data) => {
        this.responseData = data;
        console.log('API Response:', this.responseData);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  toggleSlideOverNewTask(): void {
    this.slideOverService.showAll(false);
  }

  toggleSlideOver(): void {
    this.slideOverService.toggle();
  }

  toggleSlideOverCreate(): void {
    this.slideOverService.showAll(true);
  }

  showAllOptions$ = this.slideOverService.showAllOptions$;

  isDotMenus: boolean[] = [];
  @ViewChildren('dotMenu') dotMenus!: QueryList<ElementRef<any>>;

  toggleDotMenu(index: number) {
    this.isDotMenus[index] = !this.isDotMenus[index];

    const dotMenu = this.dotMenus.toArray()[index];
    if (dotMenu) {
      if (this.isDotMenus[index]) {
        this.renderer.removeClass(dotMenu.nativeElement, 'hidden');
      } else {
        this.renderer.addClass(dotMenu.nativeElement, 'hidden');
      }
    }
  }

  onClickOpenSlideOver(taskId: any) {
    this.taskService.setTaskId(taskId);
  }

  deleteTask(id: any) {
    this.taskService.deleteTask(id);
  }

  NewTaskSliderTextElements = {
    header: 'New Task',
    description:
      'Get started by filling in the information below to create a new task',
    button: 'Create',
  };

  EditTaskSliderTextElements = {
    header: 'Edit Task',
    description:
      'Correct the data and use the "Update"-Button for updating the task',
    button: 'Update',
  };

  setHeaderFields(header: string, description: string, button: string): void {
    this.slideOverService.setSliderHeader(header, description, button);
  }
  comparisonDate: Date = new Date('1970/01/01')
}
