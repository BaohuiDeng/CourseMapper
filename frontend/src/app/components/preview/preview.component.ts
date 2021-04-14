import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import {AuthService} from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {PreviewService} from 'src/app/services/preview.service'
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  user=null;
  courseId:any
  course = null;

  constructor(
    private http: HttpClient,
    private authService:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    private previewService:PreviewService


  ) {
    this.authService.getUser()
    .subscribe(
      data=>{
        console.log(data['user'])
        this.user = data['user']
      }
    )
   }

  ngOnInit(): void {
    this.courseId =  this.route.snapshot.paramMap.get('c._id')
    console.log(this.courseId)

    this.previewService.getOneCourseById(this.courseId).subscribe(
      data=>{
        console.log(data)
          this.course =data['course']
      }
    )

  }

}
