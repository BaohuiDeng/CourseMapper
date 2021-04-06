import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  baseUrl:string = "http://localhost:3000/api";
  httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
      withCredentials:true
    };
  constructor(private http: HttpClient) { }


  createNewCourse(){
  

    let params = new HttpParams({
      fromObject: { 
        name:"hello world",
       category: "6001afa4f5437537f7ac3700",
       description: "kd",
       smallDescription:"aefe",
       tags:"123"
      },
    });
  
    return this.http.post('http://localhost:3000/api/courses', params.toString(), this.httpOptions).pipe(
      map(
        (resp) => {
        
          console.log('return http', resp);
          return resp;
        },
        (error) => {
          console.log('return http error', error);
          return error;
        }
      )
    );
  
  

    
  

    
 
  

  
}}
