import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {LoginData} from '../navbar/loginData';
import { Observable, Subscription } from 'rxjs';
import {User } from '../user';
import {first } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:'';
  errorMsg:'';
  loginData = new LoginData( '', '')
  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    private router: Router,
    private authService : AuthService,
    ) {
      this.authService.getUser()
    .subscribe(
      data=>{this.addName(data);
        console.log(data)
      console.log(data['user']['username'])
    }

      // error=>this._router.navigate(['/login'])
    )
    }
   
    addName(data){
      this.user = data['user']
    }
  ngOnInit(): void {
    
  }



 
  login(){
    this.authService.login(this.loginData)
    .subscribe(
      data=>{
        console.log('logged in!')
        window.location.reload()
        this.toastr.success('', "You're now logged in!");

      },
      error =>
      this.errorMsg = error
    )
  }


    logout(){
      this.authService.logout()
      .subscribe(data=>{
        console.log('you are logged out')
        window.location.reload();
      }
      )
    }
  
   }
