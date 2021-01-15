import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {LoginData} from '../navbar/loginData';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rememberMe = false;
  errors = [];
  //user = null;
  referer = false;
  isLoading = false;
  isLoggedIn=false;
  hasTriedToLogin=false;
  isCheckingForLogin=false;
  errorMsg='';
  username='';
  user1$:Observable<boolean>
  UserName$:Observable<string>;
  Image$:Observable<string>;

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private authService : AuthService,

    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
   });
    this.user1$ = this.authService.isLoggesIn;
    this.UserName$ = this.authService.currentUserName;
    this.Image$ = this.authService.getImage;
  }
  
  loginData = new LoginData( '', '')

  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  login(){
    this.isLoading = true;

    this.authService.login(this.loginData)
    .subscribe(
      result=>{
        if (result) {
          this.user1$ = result.user;
          this.isLoggedIn = true;
      
          localStorage.setItem('user1','1')
          localStorage.setItem('username',result.user['username'])
          localStorage.setItem('image',result.user['image'])

          console.log(result.user['username']);
          this.toastr.success('', "You're now logged in!");
          this.isLoading = false;
          console.log(this.user1$);
          this.authService.setUserInfo({'user' : result['user']});
          //window.location.reload()
          this.router.navigate(['/accounts/',{
            queryParams:{username:    this.UserName$
            }
          }]);

      }},
      error =>{
         this.isLoggedIn = false;
        // this.errors = data.errors;
        this.errorMsg = error,
        console.log(error)
      }

    )}

    logout(){
      this.authService.logout()
      .subscribe(
        data=>{
          console.log(data);
          localStorage.removeItem('username')
          localStorage.removeItem('user1')
    
          window.location.reload()
          this.router.navigate(['/'])
        },
        error=>console.error(error)
      )
    }

}
