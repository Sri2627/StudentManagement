import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EXAMTITLE } from '../models/etitles.model';
const baseUrl = 'http://localhost:8080/api/examtitles';
@Injectable({
  providedIn: 'root'
})
export class ExamtitlesService {


  constructor(private http: HttpClient) { }

  getAll(): Observable<EXAMTITLE[]> {
    return this.http.get<EXAMTITLE[]>(baseUrl);
  }

  get(id: any): Observable<EXAMTITLE> {
    return this.http.get<EXAMTITLE>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<EXAMTITLE[]> {
    return this.http.get<EXAMTITLE[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<EXAMTITLE[]> {
 
    return this.http.get<EXAMTITLE[]>(`${baseUrl}?customerid=${customerid}`);
     
  }

  findByclass(section: any): Observable<EXAMTITLE[]> {
    return this.http.get<EXAMTITLE[]>(`${baseUrl}?section=${section}`);
  }



  findByStudentid(section: any): Observable<EXAMTITLE[]> {

    console.log(section);
    return this.http.get<EXAMTITLE[]>(`${baseUrl}/sm/?section=${section}`);
     
  }
   
}


