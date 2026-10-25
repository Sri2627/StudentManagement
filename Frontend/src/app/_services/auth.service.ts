import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArrayType } from '@angular/compiler';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(private http: HttpClient,  public router: Router) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  
  }

  register(
    username: string,
    email: string, 
    password: string, 
    roles: any, 
    fullname:  String,
    mobile: String,
    address: String,
    standard: String,
    section: String,
    profile: String,
    photourl: String,
    admissionno: String,

    ): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles,
      fullname,
      mobile,
      address,
      standard,
      section,
      profile,
      photourl,
      admissionno,
    }, httpOptions);
  }

  tregister(
    username: string,
    email: string, 
    password: string, 
    roles: any, 
    fullname:  String,
    mobile: String,
    address: String,
    standard: String,
    subject: String,
    section: String,
    mysections: any, 
    profile: String,
    photourl: String,
    admissionno: String,

    ): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles,
      fullname,
      mobile,
      address,
      standard,
      subject,
      section,
      mysections,
      profile,
      photourl,
      admissionno,
    }, httpOptions);
  }

  aregister(

    username: string,
    email: string, 
    password: string, 
    roles: any, 
    fullname:  String,
    mobile: String,
    address: String,
    standard: String,
    section: String,
    profile: String,
    code: String,

    ): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles,
      fullname,
      mobile,
      address,
      standard,
      section,
      profile,
      code,
    }, httpOptions);
  }


  
}
