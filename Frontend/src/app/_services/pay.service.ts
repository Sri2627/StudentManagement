import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/accounts.model';

import { Subject } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/payment';

 
function _window() : any {
  return window;

}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
   
  constructor(private http: HttpClient) { }
  
   
  create(data: any): Observable<any> {

    console.log(data);
    return this.http.post(baseUrl, data);
  }

  get nativeWindow() :any{

    return _window();

  }
   
  
  

} 
