import { Injectable } from '@angular/core';
 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { EVENT } from '../models/event.model';
import { CONTENT } from '../models/content.model';


const baseUrl = 'http://localhost:8080/api/content';

@Injectable({
  providedIn: 'root'
})
export class ContentService {


 
    constructor(private http: HttpClient) { }
  
    getAll(): Observable<CONTENT[]> {
      return this.http.get<CONTENT[]>(baseUrl);
    }
  
    get(id: any): Observable<CONTENT> {
      return this.http.get<CONTENT>(`${baseUrl}/${id}`);
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
  
    findByTitle(title: any): Observable<CONTENT[]> {
      return this.http.get<CONTENT[]>(`${baseUrl}?title=${title}`);
    }
  
    findBydate(date: any): Observable<CONTENT[]> {
  
      console.log(date);
      return this.http.get<CONTENT[]>(`${baseUrl}/sm/?date=${date}`);
       
    }
    findByStudentid(customerid: any): Observable<CONTENT[]> {
  
      console.log(customerid);
      return this.http.get<CONTENT[]>(`${baseUrl}/sm/?customerid=${customerid}`);
       
    }
     
  }
  
  
   
  
  
  