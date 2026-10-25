import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Students } from '../models/student.model';

const baseUrl = 'http://localhost:8080/api/students';
const   classurl = 'http://localhost:8080/api/classroom';
const uurl ='http://localhost:8080/api/studentpassword';

const studentupdateurl ='http://localhost:8080/api/student';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  getStudents() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getAll(): Observable<Students[]> {
    return this.http.get<Students[]>(baseUrl);
  }

  get(id: any): Observable<Students> {

    console.log(id);
    return this.http.get<Students>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {

    console.log(data);
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${studentupdateurl}/${id}`, data);
  }
  changepassword(id: any, data: any): Observable<any> {

    console.log(data);
    return this.http.put(`${uurl}/${id}`, data);
  }


  delete(id: any): Observable<any> {
    console.log(id);
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByrole(roles: any): Observable<Students[]> {
    debugger
    return this.http.get<Students[]>(`${baseUrl}?roles=${roles}`);
  }
  findByclass(standard: any): Observable<Students[]> {
    return this.http.get<Students[]>(`http://localhost:8080/api/class/?standard=${standard}`);
  }
  findByCustmerid(section: any): Observable<Students[]> {

    
    return this.http.get<Students[]>(`${classurl}?section=${section}`);
     
  }

  findBystandard(statndard: any): Observable<Students[]> {
debugger
console.log(statndard);
 
    return this.http.get<Students[]>(`http://localhost:8080/api/class/?section=${statndard}`);
     
  }



  findBycode(code: any): Observable<Students[]> {
  
    return this.http.get<Students[]>(`http://localhost:8080/api/admins/?code=${code}`);
         
      }
  // findByclass(section: any): Observable<Students[]> {
  //   return this.http.get<Students[]>(`${classurl}?section=${section}`);
  // }
   
 
}