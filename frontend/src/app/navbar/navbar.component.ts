import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {LoginData} from '../navbar/loginData';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  rememberMe = false;
  errors = [];
  //user = null;
  referer = false;
  isLoading = false;
  isLoggedIn=false;
  hasTriedToLogin=false;
  isCheckingForLogin=false;
  errorMsg='';
  user1$:Observable<boolean>
  UserName$:Observable<string>;
  Image$:Observable<string>;


  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    private router: Router,
    private authService : AuthService,
    ) {
    
    }

  ngOnInit(): void {
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
          
          //this.sharedService.user = this.user;
          //this.authService.getUser(this.user) 
         // localStorage.setItem('userinfo1',data.user.toString())
          // localStorage.setItem('userinfo',JSON.stringify(data))
          // this.cookie.set("userid",JSON.stringify(this.user));
          localStorage.setItem('user1','1')
          localStorage.setItem('username',result.user['username'])
          localStorage.setItem('image',result.user['image'])

          console.log(result.user['username']);
          this.toastr.success('', "You're now logged in!");
          this.isLoading = false;
          console.log(this.user1$);
          this.authService.setUserInfo({'user' : result['user']});
          window.location.reload()
      }},
      error =>{
         this.isLoggedIn = false;
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
        this.router.navigate(['/'])
    .then(() => {
      window.location.reload();
    });

      },
      error=>console.error(error)
    )
  }
  }

  
