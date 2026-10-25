import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ASMT } from '../models/asmt.model';

const baseUrl = 'http://localhost:8080/api/assignments';

@Injectable({
  providedIn: 'root'
})
export class ASMTService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ASMT[]> {
    return this.http.get<ASMT[]>(baseUrl);
  }

  get(id: any): Observable<ASMT> {
    return this.http.get<ASMT>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {

    console.log(data);
    console.log("service");
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

  findByTitle(title: any): Observable<ASMT[]> {
    return this.http.get<ASMT[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<ASMT[]> {
    console.log("asmt satarted");
    console.log(customerid);
    return this.http.get<ASMT[]>(`${baseUrl}?customerid=${customerid}`);
     
  }
  findByStudentid(customerid: any): Observable<ASMT[]> {

    console.log(customerid);
    return this.http.get<ASMT[]>(`${baseUrl}/sm/?customerid=${customerid}`);
     
  }
   
}


 
