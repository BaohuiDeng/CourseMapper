import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import {LoginData} from '../navbar/loginData';
import {User} from '../user';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    //User related properties
    private user1 = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private Username = new BehaviorSubject<string>(localStorage.getItem('username'));
    private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));
    private Image = new BehaviorSubject<string>(localStorage.getItem('image'));
    user: null;
    isCheckingForLogin = false;
    showLoginModal = false;
    isLoggedIn = false;
    hasTriedToLogin = false;
    loginData = new LoginData('','');
    errorMsg='';

    baseUrl:string = "http://localhost:3000/api";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
      };

      checkLoginStatus():boolean
      {
          var loginCookie = localStorage.getItem('user1');
          if(loginCookie =="1"){
              return true;
          }
        return false;
      }
      get isLoggesIn(){
          return this.user1.asObservable();
      }
      get currentUserName(){
          return this.Username.asObservable();
      }
      get currentUserRole(){
          return this.UserRole.asObservable();
      }
      get getImage(){
          return this.Image.asObservable();
      }
      
    public isAuthenticated() : Boolean {
        let userData = localStorage.getItem('token2')
        if(userData && JSON.parse(userData)){
          return true;
        }
        return false;
      }
    

    public setUserInfo(user){
        localStorage.setItem('token2', JSON.stringify(user));
      }

    login(body:any){
        return this.http.post<any>(this.baseUrl+'/accounts/login',body,{
           observe:'body',
           withCredentials:true,
           headers:new HttpHeaders().append('Content-Type','application/json') 
        })
        .pipe(catchError(this.errorHandler_login))
    }
      errorHandler_login(error:HttpErrorResponse){
        return throwError("Wrong username or password!");
        //return throwError(error);
}
      

    signup(user:User){
      return  this.http.post<any>(this.baseUrl + "/accounts/signup",user)
        .pipe(catchError(this.errorHandler))
    }
    errorHandler(error:HttpErrorResponse){
        return throwError("User is exists!");
        //return throwError(error);
}

    getUser(){
            return this.http.get<any>(this.baseUrl+'/account/:username',{
                observe:'body',
                withCredentials:true,
                headers:new HttpHeaders().append('Content-Type','application/json')
            })
          
    }
    logout(){
         
        return this.http.get<any>(this.baseUrl+'/accounts/logout',{
            observe:'body',
            withCredentials:true,
            headers:new HttpHeaders().append('Content-Type','application/json')
        })
      
}

}