import { Injectable } from '@angular/core';
 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { EVENT } from '../models/event.model';


const baseUrl = 'http://localhost:8080/api/events';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<EVENT[]> {
    return this.http.get<EVENT[]>(baseUrl);
  }

  get(id: any): Observable<EVENT> {
    return this.http.get<EVENT>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    console.log("messages satarted");
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

  findByTitle(title: any): Observable<EVENT[]> {
    return this.http.get<EVENT[]>(`${baseUrl}?title=${title}`);
  }

  findBydate(date: any): Observable<EVENT[]> {

    console.log(date);
    return this.http.get<EVENT[]>(`${baseUrl}/sm/?date=${date}`);
     
  }
  findByStudentid(customerid: any): Observable<EVENT[]> {

    console.log(customerid);
    return this.http.get<EVENT[]>(`${baseUrl}/sm/?customerid=${customerid}`);
     
  }
   
}


 


