import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../../shared/task.model';
import { TodosService } from './todos.component.service';
import { SlideOverService } from '../../../services/slide_over.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { RouterLink, RouterOutlet } from '@angular/router';

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

  constructor(private tdService: TodosService, private slideOverService: SlideOverService) {


  //  this.showAllOptions$.subscribe((showAll) => {
  //   console.log('this is ' + showAll)
  //   return showAll})
  }

  ngOnInit(): void {
    this.tasks = this.tdService.getTasks(); 
    this.tdService.tasksChanged.subscribe((tasks: Task[])=> {
      this.tasks = tasks;
    });


       this.slideOverService.isOpen$.subscribe(isOpen$ => {
      this.isOpen = isOpen$;
    });
  }
  toggleSlideOver(): void {
    this.slideOverService.toggle(); 

  }

  toggleSlideOverCreate(): void {
    this.slideOverService.showAll(true)
    console.log('in component.ts showAll' + this.showAllOptions$)
    }

   showAllOptions$ = this.slideOverService.showAllOptions$ 
}