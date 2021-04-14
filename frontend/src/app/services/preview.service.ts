import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  baseUrl:string = "http://localhost:3000/api";

  constructor(
    private http: HttpClient
  ) { }

  getOneCourseById(id:string){
    return this.http.get(this.baseUrl+'/course/'+id)

  }
}
