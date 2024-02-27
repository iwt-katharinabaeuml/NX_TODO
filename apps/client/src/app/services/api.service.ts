import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  apiUrl = '/api/tasks';

  getData() {
    console.log('von der API' + this.http.get<any>(this.apiUrl));
    return this.http.get<any>(this.apiUrl);
  }

  getDataById(id: any) {
    console.log('über Id von API' + this.http.get<any>(this.apiUrl + '/' + id));
    console.log(this.apiUrl + '/' + id);
    return this.http.get<any>(this.apiUrl + '/' + id);
  }

  deleteDataById(id: any) {
    console.log('this will be deleted' + this.apiUrl + '/' + id);
    return this.http.delete<any>(this.apiUrl + '/' + id).subscribe(
      (response) => {
        console.log('task deleted', response);
        // Führe hier weitere Aktionen nach dem Löschen aus, falls erforderlich
      
      },
      (error) => {
        console.error('deletion failed', error);
      }
    );
}}
