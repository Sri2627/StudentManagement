import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mes } from '../models/mes.model';

const baseUrl = 'http://localhost:8080/api/meses';

@Injectable({
  providedIn: 'root'
})
export class MesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Mes[]> {
    return this.http.get<Mes[]>(baseUrl);
  }

  get(id: any): Observable<Mes> {
    return this.http.get<Mes>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<Mes[]> {
    return this.http.get<Mes[]>(`${baseUrl}?title=${title}`);
  }
}
