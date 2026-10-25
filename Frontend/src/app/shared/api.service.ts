import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
 
import { map, Observable } from 'rxjs';


const baseUrl = 'http://localhost:8000/Students';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http:HttpClient) { }

postStudent(data:any){

  return this.http.post<any>("http://localhost:3000/Students/", data).pipe(map((res:any)=>{ return res;}))

}

getStudents(){

  return this.http.get<any>("http://localhost:3000/Students").pipe(map((res:any)=>{ return res;}))
}

updateStudent(data:any, id:number){

return this.http.put<any>("http://localhost:3000/Students/"+id , data).pipe(map((res:any)=>{return res;}))

}


findprofile(id:any){
    return this.http.get("http://localhost:3000/Students/"+id ).pipe(map((res:any)=>{return res;}))
 
    //return this.http.get(`${baseUrl}/${id}`);
  
  
  }


deleteStudent(id: number){
  return this.http.delete<any>("http://localhost:3000/Students/"+id ).pipe(map((res:any)=>{return res;}))
}



}
