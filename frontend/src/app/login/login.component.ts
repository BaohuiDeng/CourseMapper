import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, 
    private toastr: ToastrService,private _router: Router) { }

  ngOnInit(): void {
  }
  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  processForm(form : NgForm){
    this.http.post(this.baseUrl + "/accounts/signUp", form.value).subscribe((data:any)=> {
      //this.toastr.success("Signup successfully");  
      console.log(form.value) ;    
      this._router.navigate(['/accounts/login/#?referer=signUp&result=success'],{queryParams: { registered: 'true' } })

      this.toastr.success('Please login using your new username and password', "Sign Up Success",{ timeOut:500})
      //this.ngOnInit();

    }
 
    );
  }
}
