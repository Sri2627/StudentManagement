import { Injectable } from '@angular/core';
 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { EVENT } from '../models/event.model';
import { SYLLABUS } from '../models/syllabus.model';


const baseUrl = 'http://localhost:8080/api/syllabus';


@Injectable({
  providedIn: 'root'
})
export class SyllabusService {

  
    constructor(private http: HttpClient) { }
  
    getAll(): Observable<SYLLABUS[]> {
      return this.http.get<SYLLABUS[]>(baseUrl);
    }
  
    get(id: any): Observable<SYLLABUS> {
      return this.http.get<SYLLABUS>(`${baseUrl}/${id}`);
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
  
    findByTitle(title: any): Observable<SYLLABUS[]> {
      return this.http.get<SYLLABUS[]>(`${baseUrl}?title=${title}`);
    }
  
 
 

    findBySubject(eid: any, sid:any): Observable<SYLLABUS> {
      return this.http.get<SYLLABUS>(`${baseUrl}/sm/?subject=${eid}&standard=${sid}`);
    }


     
  }
  
  
   
  
  
  