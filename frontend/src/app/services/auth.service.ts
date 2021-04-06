import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import {LoginData} from '../navbar/loginData';
import {User} from '../user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  loginData = new LoginData('','');
  errorMsg='';

  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
    };
    constructor(private http: HttpClient) { 
      

    }

    getUser(){
      return this.http.get(this.baseUrl+'/account',{
        withCredentials:true,
        headers:new HttpHeaders().append('Content-Type','application/json')
      });
    }

    login(body:any){
      return this.http.post(this.baseUrl+'/accounts/login',body,{
        observe:'body',
        withCredentials:true,
        headers:new HttpHeaders().append('Content-Type','application/json')
      })
      .pipe(catchError(this.LoginErrorHandler));
    }
    LoginErrorHandler(error:HttpErrorResponse){
      return throwError('wrong username or password')
    }

 
    signup(user:User){
      return  this.http.post<any>(this.baseUrl + "/accounts/signup",user)
        .pipe(catchError(this.errorHandler))
    }
    errorHandler(error:HttpErrorResponse){
        return throwError("User is exists!");
        
}

  logout(){
    return this.http.get(this.baseUrl+'/accounts/logout',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }


  

}
