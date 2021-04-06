import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { CourselistService } from '../services/courselist.service';
import {FormControl, FormGroup} from '@angular/forms'
import {AuthService} from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {CoursesService} from '../services/courses.service'
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { ViewChild , ElementRef} from '@angular/core'
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';


export interface Fruit {
  name: string;
}

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
  userId:string;
  user=null;
  categoryId:string;
  config ={
    toolbar:[
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'], 
      [{ 'color': [] }, { 'background': [] }],          
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']              ]
  }
  visible = true;
  selectable = true;
  removable = true;
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  // fruits: string[] = [''];
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials:true
  };
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // fromObject:{
  //   name:string,
  //   category:string,
  //   description: string,
  //   smallDescription:string,
  //   tags:string
  // }


  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private courseListService:CourselistService,
    private authService:AuthService,
    private CoursesService:CoursesService
      
      ) {
        this.editorForm = new FormGroup({
          "name":new FormControl(null),
          "description":new FormControl(null),
          "smallDescription":new FormControl(null),
          //"tags": new FormControl(null),
        })

        this.authService.getUser()
        .subscribe(
          data=>{
            console.log(data['user'])
            this.user = data['user']
          }
        )

    // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }
 

  ngOnInit() {
   

    

  
    
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
         // this.initTagFromSearch();
        })
      },
      error: error=>{
        this.error = error
      }
    })
  }

  // maxLength(e){
  //   console.log(e)
  // }
 

  createNewCourse(){
    console.log(this.editorForm.value)
    console.log( this.editorForm.getRawValue()['name'])
    console.log(this.fruits,typeof(this.fruits))
    let body = {
      name:this.editorForm.value.name,
      category:this.category._id,
      description:this.editorForm.value.description,
      smallDescription:this.editorForm.value.smallDescription
    }
    //  let params = new HttpParams({
    //   fromObject:   {
    //     name:"hed",
    //      category: "6001afa4f5437537f7ac3700",
    //      description: "<div>TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.</div><div><br></div>",
    //      smallDescription:"aefe",
    //      tags:"lkdmflke"
    //   }

    //});
      
    //  this.http.post('http://localhost:3000/api/courses', body, this.httpOptions)
    // .subscribe(data=>console.log(data),error=>console.log(error))

   
    

  }

 



  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }


  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.fruits.push(event.option.viewValue);
  //   this.fruitInput.nativeElement.value = '';
  //   this.fruitCtrl.setValue(null);
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }

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
