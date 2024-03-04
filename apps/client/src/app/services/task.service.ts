import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { ApiService } from './api.service';

import { Task } from '../lists/shared/task.model';
import { Priority, TaskListDto, UpdateTaskDto } from './api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  taskId$: Observable<number | null> = this.taskIdSubject.asObservable();

  constructor(private apiService: ApiService,) {
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
      console.log(this.tasks + 'in fetchTasks')
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
      this.apiService.deleteDataById(id).subscribe(
        () => {
          this.fetchTasks();
        },
        (error) => {
          console.error(error);
        }
      );
  }
  fastCompleteTask(id: any) {
    this.apiService.getDataById(id).pipe(
      switchMap(body => {
        if (!body) {
          throw new Error('Data not found');
        }
        const completedTask: UpdateTaskDto = {
          description: body.description,
          creationDate: body.creationDate,
          completionDate: new Date(),
          priority: body.priority as Priority,
          completed: true
        };
        return this.apiService.updateDateById(id, completedTask);
      })
    ).subscribe(
      () => {
        console.log('Task completed successfully.');
        this.fetchTasks();


      },
      error => {
        console.error('Error completing task:', error);
      }
    );
  }
  fastUncompleteTask(id: any) {
    this.apiService.getDataById(id).pipe(
      switchMap(body => {
        if (!body) {
          throw new Error('Data not found');
        }
        const uncompletedTask: UpdateTaskDto = {
          description: body.description,
          creationDate: body.creationDate,
          completionDate: new Date(), // Setze das completionDate auf den 1. Januar 1970
          priority: body.priority as Priority,
          completed: false // Setze completed auf false
        };
        return this.apiService.updateDateById(id, uncompletedTask);
      })
    ).subscribe(
      () => {
        console.log('Task uncompleted successfully.');
        this.fetchTasks(); // Lade die Aufgaben erneut, nachdem die Aufgabe als unvollständig markiert wurde
      },
      error => {
        console.error('Error uncompleting task:', error);
      }
    );
  }
 }
