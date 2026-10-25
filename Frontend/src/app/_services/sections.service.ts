import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SECTION } from '../models/section.model';  

const baseUrl = 'http://localhost:8080/api/sections';
 
@Injectable({
  providedIn: 'root'
})
export class SectionService {

 
  constructor(private http: HttpClient) { }

  getAll(): Observable<SECTION[]> {
    return this.http.get<SECTION[]>(baseUrl);
  }

  get(id: any): Observable<SECTION> {
    return this.http.get<SECTION>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<SECTION[]> {
    return this.http.get<SECTION[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<SECTION[]> {
 
    return this.http.get<SECTION[]>(`${baseUrl}?customerid=${customerid}`);
     
  }

  findByclass(section: any): Observable<SECTION[]> {
    return this.http.get<SECTION[]>(`${baseUrl}?section=${section}`);
  }



  findByStudentid(section: any): Observable<SECTION[]> {

    console.log(section);
    return this.http.get<SECTION[]>(`${baseUrl}/sm/?section=${section}`);
     
  }
   
}
