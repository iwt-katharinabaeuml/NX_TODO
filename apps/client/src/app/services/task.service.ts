
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  taskId$: Observable<number | null> = this.taskIdSubject.asObservable();

  constructor() { }

  setTaskId(taskId: number) {
    this.taskIdSubject.next(taskId);
  }
}