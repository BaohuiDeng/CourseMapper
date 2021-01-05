import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import{User} from '../user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(   private http: HttpClient, 
    private toastr: ToastrService,private _router: Router) { }

  ngOnInit(): void {
  }
  
 userModel = new User('','','','')

  baseUrl:string = "http://localhost:3000/api";
  categories = [];

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  processForm(){
    console.log(this.userModel);
    this.http.post(this.baseUrl + "/accounts/signup", this.userModel).subscribe((data:any)=> {
      this.toastr.success("Signup successfully");  
      this._router.navigate(['/accounts/login/#?referer=signUp&result=success'],{queryParams: { registered: 'true' } })

      //this.toastr.success('Please login using your new username and password', "Sign Up Success",{ timeOut:500})
      //this.ngOnInit();

    }
 
    );
  }
}
