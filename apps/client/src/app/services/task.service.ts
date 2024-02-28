import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { TodosService } from '../lists/todos/todos/todos.component.service';
import { Task } from '../lists/shared/task.model';
import { TaskListDto } from './api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  taskId$: Observable<number | null> = this.taskIdSubject.asObservable();

  constructor(private apiService: ApiService, private tdService: TodosService) {
    this.fetchTasks();
  }

  setTaskId(taskId: number) {
    this.taskIdSubject.next(taskId);
  }

  private tasks: Task[] = [];
  tasksChanged = new Subject<Task[]>();

  fetchTasks(): void {
    this.apiService.getData().subscribe((data: TaskListDto) => {
      this.tasks = data.map((element) => element as Task);
      this.tasksChanged.next(this.tasks);
    });
  }

  getTasks(): Task[] {
    return this.tasks.slice();
  }
  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksChanged.next(this.getTasks());
  }

  deleteTask(id: any) {
  console.log('this id should be deltete during the next steps: ' + id)
      this.apiService.deleteDataById(id).subscribe(
        () => {
          this.fetchTasks();
        },
        (error) => {
          console.error(error);
        }
      );

  }
}
