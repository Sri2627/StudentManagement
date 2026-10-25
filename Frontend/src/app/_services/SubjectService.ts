import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SUBJECT } from '../models/subjects.model';
 

const baseUrl = 'http://localhost:8080/api/subjects';
@Injectable({
  providedIn: 'root'
})
export class SubjectService {
 
 
  constructor(private http: HttpClient) { }

  getAll(): Observable<SUBJECT[]> {
    return this.http.get<SUBJECT[]>(baseUrl);
  }

  get(id: any): Observable<SUBJECT> {
    return this.http.get<SUBJECT>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
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

  findByTitle(title: any): Observable<SUBJECT[]> {
    return this.http.get<SUBJECT[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<SUBJECT[]> {
 
    return this.http.get<SUBJECT[]>(`${baseUrl}?customerid=${customerid}`);
     
  }

  findByclass(section: any): Observable<SUBJECT[]> {
    return this.http.get<SUBJECT[]>(`${baseUrl}?section=${section}`);
  }



  findByStudentid(section: any): Observable<SUBJECT[]> {

    console.log(section);
    return this.http.get<SUBJECT[]>(`${baseUrl}/sm/?section=${section}`);
     
  }
   
}


