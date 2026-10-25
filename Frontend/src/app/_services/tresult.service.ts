

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TRESULTS } from '../models/totalresult.model';
 

const baseUrl = 'http://localhost:8080/api/totalresults';
 
@Injectable({
  providedIn: 'root'
})
export class TresultService {

 
  constructor(private http: HttpClient) { }

  getAll(): Observable<TRESULTS[]> {
    return this.http.get<TRESULTS[]>(baseUrl);
  } 

  get(id: any): Observable<TRESULTS> {
    debugger
    //return this.http.get<TRESULTS>(`${baseUrl}/sid?title=${id}`);
    return this.http.get<TRESULTS>(`http://localhost:8080/api/totalresults/sid?title=202203`);
    
  }

  getbystudentno(id: any): Observable<TRESULTS> {
  
    return this.http.get<TRESULTS>(`${baseUrl}/sid?title=${id}`);
  }

 
  create(data: any): Observable<any> {
debugger
    console.log(data);
 
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<TRESULTS[]> {
    return this.http.get<TRESULTS[]>(`${baseUrl}/sm?title=${title}`);
  }

 
 

  
   
}


