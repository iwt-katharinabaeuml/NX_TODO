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
  tasksChanged = new Subject<Task[]>();

  constructor(private readonly apiService: ApiService) {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.getData().subscribe((data: TaskListDto) => {
      this.tasks = data.map(element => element as Task);
      this.tasksChanged.next(this.tasks);
    });
  }

    getTasks(): Task[] {
      return this.tasks.slice();
    }
    addTask(task: Task) {
      this.tasks.push(task);
      this.tasksChanged.next(this.getTasks());
    }}



