import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FILEBOX } from '../models/filebox.model';

const baseUrl = 'http://localhost:8080/api/filebox';

@Injectable({
  providedIn: 'root'
})
export class FileBoxService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<FILEBOX[]> {
    return this.http.get<FILEBOX[]>(baseUrl);
  }

  get(id: any): Observable<FILEBOX> {
    return this.http.get<FILEBOX>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<FILEBOX[]> {
    return this.http.get<FILEBOX[]>(`${baseUrl}?title=${title}`);
  }

  findBypatentid(customerid: any,parentid: any): Observable<FILEBOX[]> {
    
    console.log(customerid);
    console.log (parentid);
    return this.http.get<FILEBOX[]>(`${baseUrl}/children/?customerid=${customerid}&parentid=${parentid}`);
     
  }
  findByStudentid(userid: any): Observable<FILEBOX[]> {

    console.log(userid);
    return this.http.get<FILEBOX[]>(`${baseUrl}/sm/?customerid=${userid}`);
     
  }
   
}

