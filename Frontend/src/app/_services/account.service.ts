import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/accounts.model';

const baseUrl = 'http://localhost:8080/api/accounts';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(baseUrl);
  }

  get(id: any): Observable<Invoice> {
    return this.http.get<Invoice>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${baseUrl}?title=${title}`);
  }
  findByStudentid(customerid: any): Observable<Invoice[]> {

    console.log(customerid);
    return this.http.get<Invoice[]>(`${baseUrl}/sm/?customerid=${customerid}`);
     
  }

  

} 
