import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
  })
export class ApiService {
  constructor(private http: HttpClient) { }


apiUrl = '/api/tasks'



getData(){console.log('von der API' + this.http.get<any>(this.apiUrl))
    return this.http.get<any>(this.apiUrl)
}

getDataById(id:any){
  console.log('über Id von API' + this.http.get<any>(this.apiUrl + '/' +id ))
  console.log(this.apiUrl + '/' +id )
return this.http.get<any>(this.apiUrl + '/' +id)
}
}