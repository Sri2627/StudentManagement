import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/accounts.model';

const baseUrl = 'http://localhost:8080/api/payment';

@Injectable({
  providedIn: 'root'
})
export class RazorService{

  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(baseUrl);
  }

  get(id: any): Observable<Invoice> {
    return this.http.get<Invoice>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {

   
    return this.http.post(baseUrl, data);
  }

  

  

} 