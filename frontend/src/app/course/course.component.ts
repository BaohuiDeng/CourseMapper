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
import { ToastrService } from 'ngx-toastr';
import {Courses} from 'src/app/models/courses.model'


export interface Fruit {
  text: string;
}

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  slug: string;
  courses:Courses[];
  coursesLength = 0
  error:any;
  category:any; 
  baseUrl:string = "http://localhost:3000/api";
  courseTags = [];
  availableTags = [];
  filterTagsText = [];
  arrayObjectIndexOf:any;
  removeObjectFromArray:any;
  orderBy = -1;
  sortBy = 'dateAdded';
  currentPage = 1;
  pageReset = false;
  lastPage = false;
  force:any;
  filterTags = [];
  editorForm: FormGroup;
  orderingOptions = [
    {id: 'dateAdded.-1', name: 'Newest First'},
    {id: 'dateAdded.1', name: 'Oldest First'},
    {id: 'totalEnrollment.-1', name: 'Most Popular'}
];


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
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
    withCredentials:true
  };
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;




  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private courseListService:CourselistService,
    private authService:AuthService,
    private CoursesService:CoursesService,
    private toastr: ToastrService,

      
      ) {
        this.editorForm = new FormGroup({
          "name":new FormControl(null),
          "description":new FormControl(null),
          "smallDescription":new FormControl(null),
        })
        //to authenciate the user
        this.authService.getUser()
        .subscribe(
          data=>{
            console.log(data['user'])
            this.user = data['user']
          }
        )
        


  }
 

  ngOnInit() {
   
    //this.getCoursesFromThisCategory(this.slug)  
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
         // console.log(this.availableTags)
          // this.course = data.courseTags['slug']
         // this.initTagFromSearch();

        })
        this.getAllCourse();
     
      },
      error: error=>{
        this.error = error
      }
    })
  }

    getAllCourse(){
      this.courseListService.getAllCourses(this.category._id).subscribe(data=>{
        this.courses = data['courses']
        this.coursesLength = this.courses.length
        // console.log(data)
        // console.log(this.courses)
        
      })
    }
 
  //create a new course
  createNewCourse(){
    // console.log(this.editorForm.value)
    // console.log( this.editorForm.getRawValue()['name'])
    // console.log(this.fruits,typeof(this.fruits))

     let params = new HttpParams({
      fromObject:   {
        name:this.editorForm.value.name,
         category: this.category._id,
         description: this.editorForm.value.description,
         smallDescription:this.editorForm.value.smallDescription,
         tags:JSON.stringify(this.fruits)
      }

    });
    console.log(params)
      
     this.http.post('http://localhost:3000/api/courses', params, this.httpOptions)
    .subscribe(
      data=>{
        console.log(data);
        this.router.navigate(['/course/' + data['course']['slug'] + '/cid/' + data['course']['_id'] ])

        // this.router.navigate(['/course/' + data['course']['slug'] + '/#/cid/' + data['course']['_id'] + '?new=1'])
        this.toastr.info('<p>You are now in a newly created course. </p>' +
        '<p>You can start by customizing this course by uploading introduction picture and video on the edit panel.</p>' +
        '<p>Collaborate and Annotate on course map and its contents in <i class="ionicons ion-map"></i> <b>Map Tab</b></p>' +
        '<p>Discuss related topic in <i class="ionicons ion-ios-chatboxes"></i> <b>Discussion Tab.</b></p>' +
        '<p>Adding widgets on <i class="ionicons ion-stats-bars"></i> <b>Analytics tab</b>.</p>' +
        '<p>Or wait for your students to enroll in to this course and start collaborating.</p>'
        , 'New course created',{
          enableHtml:true,
          extendedTimeOut: 30000,
          timeOut: 30000,
          closeButton	:true,
          tapToDismiss:false,
          //toastClass	:'wide'
        });
      },error=>{
        this.toastr.warning("course exists!")
        console.log(error)
      })

   
    

  }

 



  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({text: value.trim()});
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





 

      applyFilter(tag){
        console.log(tag['name'])
        console.log(tag)
        this.filterTags.push(tag)
        console.log(this.filterTags)
        this.filterTagsText.push(tag.slug);
        const index: number = this.availableTags.indexOf(tag);
        if (index !== -1) {
            this.availableTags.splice(index, 1);
        }            
          this.go();
      }


      go(){
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams:{tags:this.filterTagsText.join(',')}, 
            queryParamsHandling: 'merge', // remove to replace all query params by provided
          });
          this.getAllCourse();
      }

      removeFilter(tag){
       
        this.availableTags.push(tag)
        const index: number = this.filterTags.indexOf(tag);
        if (index !== -1) {
            this.filterTags.splice(index, 1);
        } 

        this.go()
      }
       
    





}
