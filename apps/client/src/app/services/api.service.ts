import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../lists/shared/task.model';
import { CreateTaskDto, UpdateTaskDto } from './api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  apiUrl = '/api/tasks';

  getData() {
    return this.http.get<any>(this.apiUrl);
  }

  getDataById(id: any) {
    return this.http.get<any>(this.apiUrl + '/' + id);
    
  }

  deleteDataById(id: any) {
    console.log(this.apiUrl + '/' + id);
    console.log('Id im Api Delete Service' + id)
    return this.http.delete<any>(this.apiUrl + '/' + id);
  }

  updateDateById(id:any, task:UpdateTaskDto){ // TODO correct Typo: updateDataById
    console.log(id)
    console.log(task)
    this.http.put<any>(this.apiUrl + '/' + id, task);
    console.log('im API Server' + (this.apiUrl + '/' + id, task))
    return this.http.put<any>(this.apiUrl + '/' + id, task);
  }

  createTask(task:CreateTaskDto){
    return this.http.post<any>(this.apiUrl, task);
  }


}
