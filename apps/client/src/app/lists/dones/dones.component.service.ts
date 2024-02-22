import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../shared/task.model';

@Injectable({
  providedIn: 'root'
})
export class DonesService {
  // private tasks: Task[] = [
  //   new Task('first Task', new Date(), new Date(), 'high', true),
  //   new Task('second Task', new Date(), new Date(), 'high', true),
  //   new Task('third Task', new Date(), new Date(), 'medium', true),
  //   new Task('fourth Task', new Date(), new Date(), 'low', true),
  //   new Task('fifth Task', new Date(), new Date(), 'none', true),
  //   new Task('sixth Task', new Date(), new Date(), 'none', true),
  // ];

  // tasksChanged = new Subject<Task[]>();

  // getTasks(): Task[] {
  //   // Return a deep copy of tasks array to prevent unexpected mutations
  //   return this.tasks.slice();
  // }

  // addTask(task: Task) {
  //   this.tasks.push(task);
  //   this.tasksChanged.next(this.getTasks());
  // }

  // You can add other methods like deleteTask, updateTask, etc. as per your requirements
}
