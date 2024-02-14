import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../../task/task/task.component';
import { Task } from '../../shared/task.model';
import { TodosService } from './todos.component.service';


@Component({
  selector: 'fse-todos',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
tasks!: Task[]

 constructor(private tdService: TodosService){}

 ngOnInit(): void {
     this.tasks = this.tdService.getTasks(); 
     this.tdService.tasksChanged.subscribe((tasks: Task[])=> {
      this.tasks = tasks;
     })
 }
}
