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
import { TodosService } from './todos.component.service';
import { SlideOverService } from '../../../services/slide_over.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'fse-todos',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})

export class TodosComponent implements OnInit {
  tasks!: Task[];
  isOpen = false;
  responseData: any;

  constructor(
    private renderer: Renderer2,
    private tdService: TodosService,
    private slideOverService: SlideOverService,
    private apiService: ApiService

  ) {}

  ngOnInit(): void {
    this.tasks = this.tdService.getTasks();
    this.tdService.tasksChanged.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });

    this.slideOverService.isOpen$.subscribe((isOpen$) => {
      this.isOpen = isOpen$;
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
    console.log('in component.ts showAll' + this.showAllOptions$);
  }

  toggleSlideOver(): void { 
   

    this.slideOverService.toggle();
  }

  toggleSlideOverCreate(): void {
    this.slideOverService.showAll(true);
    console.log('in component.ts showAll' + this.showAllOptions$);
  }

  showAllOptions$ = this.slideOverService.showAllOptions$;

  isDotMenus: boolean[] = [];
  @ViewChildren('dotMenu') dotMenus!: QueryList<ElementRef<any>>;

  toggleDotMenu(index: number) {
    this.isDotMenus[index] = !this.isDotMenus[index];

    console.log('Menu toggle wurde aktiviert mit ' + this.isDotMenus[index]);

    const dotMenu = this.dotMenus.toArray()[index];
    if (dotMenu) {
      if (this.isDotMenus[index]) {
        this.renderer.removeClass(dotMenu.nativeElement, 'hidden');
      } else {
        this.renderer.addClass(dotMenu.nativeElement, 'hidden');
      }
    }
  }
}
