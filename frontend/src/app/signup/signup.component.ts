import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {User} from '../user';
import {AuthService} from '../services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(   
    private http: HttpClient, 
    private toastr: ToastrService,
    private router: Router,
    private authService:AuthService
    ) { }

  ngOnInit(): void {
  }
  
 userModel = new User('','','','','','','','',false,'','','')
 errors=[];
 isLoading = false;
 errorMsg = '';
 errorTransfer='';

  baseUrl:string = "http://localhost:3000/api";

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  
  onSubmit(){
    console.log(this.userModel);
    this.authService.signup(this.userModel)
     .subscribe(
       data=>{
        this.toastr.success("Please login using your new username and password","Signup successfully");  
        this.router.navigate(['/accounts/login/#?referer=signUp&result=success'])      
       console.log('Success',data)},
       error => 
      // this.errorMsg = error.statusText
      this.errorMsg = error


     )
  }
}
