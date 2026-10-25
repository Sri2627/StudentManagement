import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Messages } from '../models/messages.model';

const baseUrl = 'http://localhost:8080/api/messages';



@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Messages[]> {
    return this.http.get<Messages[]>(baseUrl);
  }

  get(id: any): Observable<Messages> {
    return this.http.get<Messages>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
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

  findByTitle(title: any): Observable<Messages[]> {
    return this.http.get<Messages[]>(`${baseUrl}?title=${title}`);
  }
}