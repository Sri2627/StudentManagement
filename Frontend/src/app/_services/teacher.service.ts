import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Students } from '../models/student.model';

const baseUrl = 'http://localhost:8080/api/teachers';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Students[]> {
    return this.http.get<Students[]>(baseUrl);
  }

  get(id: any): Observable<Students> {
    return this.http.get<Students>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    console.log(id);
    return this.http.delete(`${baseUrl}/delete/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByrole(roles: any): Observable<Students[]> {
    return this.http.get<Students[]>(`${baseUrl}?roles=${roles}`);
  }
  findByclass(section: any): Observable<Students[]> {
    return this.http.get<Students[]>(`${baseUrl}?section=${section}`);
  }
  

  
}