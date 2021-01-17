import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourselistService } from '../services/courselist.service';
import {FormControl, FormGroup} from '@angular/forms'

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  slug: string;
  error:any;
  category:any;
  baseUrl:string = "http://localhost:3000/api";
  courseTags = [];
  availableTags = [];
  orderBy = -1;
  sortBy = 'dateAdded';
  currentPage = 1;
  pageReset = false;
  lastPage = false;
  force:any;
  filterTags = [];
  editorForm: FormGroup;
  editorContent: string;
  config ={
    toolbar:[
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'], 
      [{ 'color': [] }, { 'background': [] }],          
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']              ]
  }

  constructor(private route: ActivatedRoute, private http: HttpClient, private courseListService:CourselistService) {}

  ngOnInit() {

    this.editorForm = new FormGroup({
      "name":new FormControl(null),
      "category":new FormControl(null),
      "description":new FormControl(null),
      "smallDescription":new FormControl(null)

    })
    
    this.route.params.subscribe(params => {
       this.slug = params['slug']; // (+) converts string 'id' to a number
    });
    this.http.get(this.baseUrl + '/category/' + this.slug).subscribe({
      next:(data:any)=>{
        this.category = data.category;
        // Page.setTitleWithPrefix(this.category.name);
        this.http.get(this.baseUrl + "/category/" + this.category._id + '/courseTags').subscribe((data:any)=> {
          this.courseTags = data.courseTags;
          this.availableTags = data.courseTags;
          this.initTagFromSearch();
        })
      },
      error: error=>{
        this.error = error
      }
    })
  }
  initTagFromSearch() {
    // var tagSearch = $location.search();
    // if (tagSearch && tagSearch.tags) {
    //     var tags = tagSearch.tags.split(',');
    //     if (tags)
    //         for (var i in tags) {
    //             var tag = tags[i];
    //             if ($scope.availableTags)
    //                 for (var j in $scope.availableTags) {
    //                     var t = $scope.availableTags[j];
    //                     if (t.slug == tag)
    //                         $scope.applyFilter(t, true);
    //                 }
    //         }
    // }

    this.getCoursesFromThisCategory(this.force);

    // $scope.$watch(function () {
    //     return $location.search()
    // }, function (newVal, oldVal) {
    //     if (newVal && newVal !== oldVal)
    //         $scope.getCoursesFromThisCategory();
    // }, true);
  }
  getCoursesFromThisCategory(force) {

    this.courseListService.setPageParams({
        sortBy: this.sortBy,
        orderBy: this.orderBy,
        limit: 12,
        lastPage: false
    });

    this.courseListService.init(this.category._id, this.filterTags,
        function (courses) {
            this.courses = courses;
            this.coursesLength = courses.length;
        },
        function (errors) {
            console.log(JSON.stringify(errors));
        }
        , force
    );
};

}
