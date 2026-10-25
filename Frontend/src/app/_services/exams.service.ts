import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EXAMS } from '../models/exams.model';

const baseUrl = 'http://localhost:8080/api/exams';
const classurl= 'http://localhost:8080/api/exams/se';
@Injectable({
  providedIn: 'root'
})
export class ExamsService {

 
  constructor(private http: HttpClient) { }

  getAll(): Observable<EXAMS[]> {
    return this.http.get<EXAMS[]>(baseUrl);
  }

  get(id: any): Observable<EXAMS> {
    return this.http.get<EXAMS>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<EXAMS[]> {
    return this.http.get<EXAMS[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<EXAMS[]> {
 
    console.log(customerid);
    return this.http.get<EXAMS[]>(`${classurl}?customerid=${customerid}`);
     
  }

  findByclass(section: any): Observable<EXAMS[]> {
    return this.http.get<EXAMS[]>(`${classurl}?section=${section}`);
  }



  findByStudentid(section: any): Observable<EXAMS[]> {

   
    return this.http.get<EXAMS[]>(`${baseUrl}/sm/?section=${section}`);
     
  }

  findBysection(section: any, customerid:any): Observable<EXAMS[]> {
    console.log("exams satarted");
    return this.http.get<EXAMS[]>(`${classurl}?section=${section}&customerid=${customerid}`);
  }

  findBycategory(section: any, title: any): Observable<EXAMS[]> {
 
    return this.http.get<EXAMS[]>(`${baseUrl}/published/?section=${section}&title=${title}`);
  }

  
   
}
