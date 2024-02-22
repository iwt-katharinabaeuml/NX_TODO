import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../shared/task.model';

import { DonesService } from './dones.component.service';


@Component({
  selector: 'fse-dones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dones.component.html',
  styleUrl: './dones.component.scss',
})
export class DonesComponent implements OnInit {
  tasks!: Task[]
  
   constructor(private donesService: DonesService){}
  
   ngOnInit(): void {
      //  this.tasks = this.donesService.getTasks(); 
      //  this.donesService.tasksChanged.subscribe((tasks: Task[])=> {
      //   this.tasks = tasks;
      //  })
   }
  } 



