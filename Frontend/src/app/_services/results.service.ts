import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RESULTS } from '../models/results.model';

const baseUrl = 'http://localhost:8080/api/results';
const rebaseUrl = 'http://localhost:8080/api/results/myresults';

 
@Injectable({
  providedIn: 'root'
})
export class ResultsService {

 
  constructor(private http: HttpClient) { }

  getAll(): Observable<RESULTS[]> {
    return this.http.get<RESULTS[]>(rebaseUrl);
    
  } 

  get(id: any): Observable<RESULTS> {
    return this.http.get<RESULTS>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<RESULTS[]> {
    return this.http.get<RESULTS[]>(`${baseUrl}?title=${title}`);
  }

  findByCustmerid(customerid: any): Observable<RESULTS[]> {
  
 
    return this.http.get<RESULTS[]>(`${baseUrl}?customerid=${customerid}`);
     
  }

  findByclass(section: any): Observable<RESULTS[]> {
    return this.http.get<RESULTS[]>(`${baseUrl}?section=${section}`);
  }


  
  

  findByStudentid(eid: any, sid:any): Observable<RESULTS> {
    return this.http.get<RESULTS>(`${baseUrl}/sm/?studentid=${sid}&examid=${eid}`);
  }

  findByStudent(sid:any,title:any): Observable<RESULTS> {
    return this.http.get<RESULTS>(`${baseUrl}/mr/?studentid=${sid}&title=${title}`);
  }


  findByexam(examid: any): Observable<RESULTS[]> {
    return this.http.get<RESULTS[]>(`${baseUrl}?examid=${examid}`);
  }

  findBystudentresult(sid: any, title:any): Observable<RESULTS[]> {
    return this.http.get<RESULTS[]>(`${baseUrl}/student/?studentid=${sid}&title=${title}`);
  }

  
   
}
