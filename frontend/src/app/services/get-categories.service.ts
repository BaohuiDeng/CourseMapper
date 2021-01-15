import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GetCategoriesService {

  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
  ) {}
  private categories = new BehaviorSubject<any>([]);
  
  cast =this.categories.asObservable();
  refreshData(){
    this.http.get(this.baseUrl + "/categories").subscribe((data:any)=> { this.categories.next(data.categories)});
  //console.log(this.categories); 
  }

  


  
}
