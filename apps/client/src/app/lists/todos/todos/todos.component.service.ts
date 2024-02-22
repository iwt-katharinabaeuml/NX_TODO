import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../../shared/task.model';
import { ApiService } from '../../../services/api.service';
import { TaskListDto } from '../../../services/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private tasks: Task[] = [];

  constructor(private readonly apiService: ApiService) {
    apiService.getData().subscribe((data: TaskListDto) => {
      data.forEach((element) => {
        this.tasks.push(element as Task);
      });
      this.tasksChanged.next(this.tasks);
    });
  }


  tasksChanged = new Subject<Task[]>();
  getTasks(): Task[] {
    return this.tasks.slice();
  }
  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksChanged.next(this.getTasks());
  }
}
