import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../../shared/task.model';
import { TodosService } from './todos.component.service';
import { SlideOverService } from '../../../services/slide_over.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'fse-todos',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  // animations: [
  //   trigger('slideInOut', [
  //     state(
  //       'in',
  //       style({
  //         transform: 'translateX(0)',
  //         opacity: 1,
  //       })
  //     ),
  //     state(
  //       'out',
  //       style({
  //         transform: 'translateX(100%)',
  //         opacity: 0,
  //       })
  //     ),
  //     transition('in => out', animate('1000ms ease-in-out')),
  //     transition('out => in', animate('500ms ease-in-out')),
  //   ]),
  // ],
})

// <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
export class TodosComponent implements OnInit {
  tasks!: Task[];
  isOpen = false;

  constructor(
    private renderer: Renderer2,
    private tdService: TodosService,
    private slideOverService: SlideOverService
  ) {
    //  this.showAllOptions$.subscribe((showAll) => {
    //   console.log('this is ' + showAll)
    //   return showAll})
  }

  ngOnInit(): void {
    this.tasks = this.tdService.getTasks();
    this.tdService.tasksChanged.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });

    this.slideOverService.isOpen$.subscribe((isOpen$) => {
      this.isOpen = isOpen$;
    });
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

  isDotMenus: boolean[] = []
  @ViewChildren('dotMenu') dotMenus!: QueryList<ElementRef<any>>;
  
  
  toggleDotMenu(index: number) {
    this.isDotMenus[index] = !this.isDotMenus[index]; // Umkehrung des Zustands für das spezifische Menü

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

  // constructor(
  //   private slideOverService: SlideOverService,
  //   private renderer: Renderer2
  // ) {
  //   this.isOpen$.subscribe((isOpen) => {
  //     if (this.panel === undefined) return;

  //     if (this.dialog === undefined) return;

  //     if (isOpen) {
  //       this.renderer['removeClass'](
  //         this.panel.nativeElement,
  //         'translate-x-full'
  //       );
  //       this.renderer['addClass'](this.panel.nativeElement, 'translate-x-0');
  //       this.renderer['removeClass'](
  //         this.dialog.nativeElement,
  //         'pointer-events-none'
  //       );
  //     } else {
  //       this.renderer['removeClass'](this.panel.nativeElement, 'translate-x-0');
  //       this.renderer['addClass'](this.panel.nativeElement, 'translate-x-full');
  //       this.renderer['addClass'](
  //         this.dialog.nativeElement,
  //         'pointer-events-none'
  //       );
  //     }
  //   });
    













  // ngAfterViewInit(): void {
  //   console.log('Menu ElementRef:', this.menu.nativeElement);

  //   this.menuOpen$.subscribe((menuOpen) => {
  //     console.log('hier kommte es an mit ' + menuOpen )
  //     if (menuOpen) {
  //       this.renderer.setStyle(this.menu.nativeElement, 'opacity', '1');
  //       this.renderer.setStyle(this.menu.nativeElement, 'z-index', '50');
  //     } else {
  //       this.renderer.setStyle(this.menu.nativeElement, 'opacity', '0');
  //       this.renderer.setStyle(this.menu.nativeElement, 'z-index', '-1');
  //     }

  //   });
  // }

