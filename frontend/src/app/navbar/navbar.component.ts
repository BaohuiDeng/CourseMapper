import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  rememberMe = false;
  errors = [];
  user = null;
  referer = false;
  isLoading = false;
  isLoggedIn=false;
  hasTriedToLogin=false;
  isCheckingForLogin=false;
  loginData = {};

  constructor(private http: HttpClient, 
    private toastr: ToastrService,private _router: Router,private authService : AuthService) { }

  ngOnInit(): void {
  }
  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
 
//   this.authService.loginCheck(function (user) {
//     this.user = user;
// });

  login(form : NgForm,isValid) {
    if (isValid) {
        this.isLoading = true;
        this.authService.login(this.loginData,
            function (user) {
               this.user = user;
                this.toastr.success('', "You're now logged in!");
                this.isLoading = false;
                console.log(user)
                window.location.reload();
            },
            function error(data) {
                if (data.errors) {
                   this.errors = data.errors;
                    this.isLoading = false;
                }
            }
        );
    }
}

  
}
