import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../../../models/user';
import { Employee } from 'src/app/shared/employee.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  API_URL: string = 'http://localhost:3000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient,public router: Router){}

  register(user: User): Observable<any> {
    //console.log(user)
    return this.httpClient.post(`${this.API_URL}/user/signup`, user ).pipe(
        catchError(this.handleError)
    )
  }

  login(user: User) {
    return this.httpClient.post<any>(`${this.API_URL}/user/login`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        // this.getUserProfile(res.token).subscribe((res) => {
        //   this.currentUser = res;
        //   this.router.navigate(['Homepage']);
        //   console.log(res)
        // })
        this.router.navigate(['Homepage']);
      })
  }
  fbLogin(){
    
  }

  loginFacebook(){
    return this.httpClient.get(`${this.API_URL}/user/auth/facebook/`)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        // this.getUserProfile(res.token).subscribe((res) => {
        //   this.currentUser = res;
        //   this.router.navigate(['Homepage']);
        //   console.log(res)
        // })
        this.router.navigate(['Homepage']);
      })
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');//getAccessToken()
    return (authToken !== null) ? true : false;
  }

  logout() {
    if (localStorage.removeItem('access_token') == null) {
      this.router.navigate(['login']);
    }
  }

  getUserProfile(token): Observable<any> {
    var header = {
      headers: new HttpHeaders()
        .set('token',  `${token}`)
    }
    return this.httpClient.get(`${this.API_URL}/user/me`,header).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}