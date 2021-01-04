import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateCategoryComponent } from '../templates/create-category/create-category.component';

declare var $ :any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  editData: { _id: any; name: any; };
  editMode=false;
  



  constructor(
    private http: HttpClient, 
    private toastr: ToastrService
    ) { }
  
  @ViewChild(CreateCategoryComponent) viewChild: CreateCategoryComponent;
  
  
  baseUrl:string = "http://localhost:3000/api";
  categories = [];
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  ngOnInit(): void {
    this.http.get(this.baseUrl + "/categories").subscribe((data:any)=> {
      this.categories = data.categories;
    });
  }

  processForm(form : NgForm){
    this.http.post(this.baseUrl + "/categories", form.value).subscribe((data:any)=> {
      this.toastr.success("Successfully added");        
      this.ngOnInit();
    });
  }
  deleteCategory(e: { catId: string; }){
    var confirm = window.confirm("Delete this category and its childs?");
    if(confirm){
      this.http.delete(this.baseUrl + "/category/" + e.catId).subscribe({
        next: (data:any)=> {
        this.toastr.success("Successfully deleted");        
        this.ngOnInit();
      },
      error:error=>{
        (data:any)=> {error.errors = data.errors;
        }}         
    });
    }
  }

  editCategory(e: { _id: any; name: any; }){
    // toggle edit mode    //-----------------------remaining to be used-------------------
    if(this.editMode){
        this.editMode = false;
        return;
    }
    this.editMode = true;
  
    this.editData = {
        _id: e._id,
        name: e.name,
      
    };
  
      $('#editCategoryModal').modal('show');
  };
// isValid if(!isValid)  return;
  saveEditCategory = function(data: any){
   
       
    this.http.put( this.baseUrl + "/category/"+"5fa175101ad79f18b600473e","").subscribe(
      {
        next: (data:any)=> {
          this.toastr.success("Category edited");  
          $('#editCategoryModal').modal('hide');      
          this.ngOnInit();
        },
        error:error=>{
          (data:any)=> {error.errors = data.errors;
          }}    
      }
    )
  };
  cancel = function () {
    $('#editCategoryModal').modal('hide');  
  };
  









}


















