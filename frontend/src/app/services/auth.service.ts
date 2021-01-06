import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {LoginData} from '../navbar/loginData';
declare var $: any;
declare var transformRequest: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    user: null;
    isCheckingForLogin = false;
    showLoginModal = false;
    isLoggedIn = false;
    hasTriedToLogin = false;
    loginData = new LoginData('','');

    //loginData={};
    baseUrl:string = "http://localhost:3000/api";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
        data:this.loginData
      };

    loginCheck(successCallback, errorCallback){
        var self = this;
        if (self.user) {
            self.isLoggedIn = true;
            successCallback(self.user);
        }
        else {
            if (self.isCheckingForLogin)
                return;
            self.isCheckingForLogin = true;

            this.http.get(this.baseUrl + '/api/account').subscribe({
                next:(data:any)=>{ 
                self.isCheckingForLogin = false;
                self.hasTriedToLogin = true;
                if (data.result) {
                    self.user = data.user;
                    self.isLoggedIn = true;
                   // $rootScope.user = data.user;
                    //$rootScope.$broadcast('onAfterInitUser', self.user);
                    successCallback(self.user);
                }
            },
            error:data=>{
                self.isCheckingForLogin = false;
                self.isLoggedIn = false;
                self.hasTriedToLogin = true;     
                if (errorCallback)
                errorCallback(data);         
            }
        }
            )
        }
    }

    login(loginData, successCallback, errorCallback) {
        var self = this;
       // var d = transformRequest(loginData);
        this.http.post(this.baseUrl +'/accounts/login',this.loginData).subscribe({
            next:(data:any)=>{ 
                if (data.result) {
                    //$rootScope.user = data.user;
                    self.user = data.user;
                    self.isLoggedIn = true;
                    console.log(data);
                    //$rootScope.$broadcast('onAfterInitUser', $rootScope.user);
                   // successCallback($rootScope.user);
                    }
                }, 
                error:data=>{
                    self.isLoggedIn = false;
                    errorCallback(data);      
                }
                
                
           
    })}
}